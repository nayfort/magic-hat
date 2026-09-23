import assert from "node:assert/strict";
import { beforeEach, test, mock } from "node:test";
import { useCharacterStore } from "../src/store/character";
import { useScoreStore } from "../src/store/score";
import { HARRY_POTTER } from "../src/constants/character";
import { characterService } from "../src/services/character";
import { GuessResult } from "../src/types";

beforeEach(() => {
  mock.restoreAll();
  useCharacterStore.setState(useCharacterStore.getInitialState(), true);
  useScoreStore.setState(useScoreStore.getInitialState(), true);
});

test("guesses update attempts without mutating previous state or the reset character", () => {
  const before = useCharacterStore.getState().activeCharacter;
  const actions = useCharacterStore.getState().actions;
  assert.equal(actions.guessCharacterHouse("Slytherin"), GuessResult.FAILED);
  const failed = useCharacterStore.getState().guessedCharacters[0];
  assert.equal(actions.guessCharacterHouse("Gryffindor"), GuessResult.SUCCESS);
  const success = useCharacterStore.getState().guessedCharacters[0];
  assert.equal(success.attempts, 2);
  assert.equal(success.isGuessed, true);
  assert.equal(failed.attempts, 1);
  assert.equal(failed.isGuessed, false);
  assert.equal(before.attempts, 0);
  assert.equal(HARRY_POTTER.attempts, 0);
  assert.equal(
    actions.guessCharacterHouse("Gryffindor"),
    GuessResult.ALREADY_GUESSED,
  );
  assert.equal(useCharacterStore.getState().guessedCharacters.length, 1);
  actions.resetGuessedCharacters();
  assert.equal(useCharacterStore.getState().activeCharacter.isGuessed, false);
  assert.equal(useCharacterStore.getState().guessedCharacters.length, 0);
});

test("random selection skips completed characters and handles an exhausted pool", () => {
  const other = { ...HARRY_POTTER, id: "other", name: "Other" };
  useCharacterStore.setState({ characters: [HARRY_POTTER, other] });
  const actions = useCharacterStore.getState().actions;
  actions.guessCharacterHouse("Gryffindor");
  actions.getRandomCharacter();
  assert.equal(useCharacterStore.getState().activeCharacter.id, "other");
  actions.guessCharacterHouse("Gryffindor");
  actions.getRandomCharacter();
  assert.equal(useCharacterStore.getState().activeCharacter.id, "other");
});

test("score updates leave previous snapshots unchanged and reset all counters", () => {
  const before = useScoreStore.getState().score;
  const actions = useScoreStore.getState().actions;
  actions.incrementSuccess();
  actions.incrementFailed();
  assert.deepEqual(before, { total: 0, success: 0, failed: 0 });
  assert.deepEqual(useScoreStore.getState().score, {
    total: 2,
    success: 1,
    failed: 1,
  });
  actions.resetScore();
  assert.deepEqual(useScoreStore.getState().score, before);
});

test("network errors are visible and a retry clears the error", async () => {
  const request = mock.method(characterService, "fetchAll", async () => {
    throw new Error("Offline");
  });
  const actions = useCharacterStore.getState().actions;
  await actions.loadCharacters();
  assert.ok(useCharacterStore.getState().error);
  assert.equal(useCharacterStore.getState().isLoading, false);
  request.mock.mockImplementation(async () => [HARRY_POTTER]);
  await actions.loadCharacters();
  assert.equal(useCharacterStore.getState().error, null);
  assert.equal(useCharacterStore.getState().characters.length, 1);
});

test("a pending load cannot overwrite a reset or manually selected character", async () => {
  let resolve!: (value: (typeof HARRY_POTTER)[]) => void;
  mock.method(
    characterService,
    "fetchAll",
    () =>
      new Promise<(typeof HARRY_POTTER)[]>((done) => {
        resolve = done;
      }),
  );
  const actions = useCharacterStore.getState().actions;
  const load = actions.loadCharacters();
  await actions.loadCharacters();
  actions.resetGuessedCharacters();
  const selected = { ...HARRY_POTTER, id: "selected" };
  actions.setActiveCharacter(selected);
  resolve([HARRY_POTTER]);
  await load;
  assert.equal(useCharacterStore.getState().activeCharacter.id, "selected");
  assert.equal(useCharacterStore.getState().isLoading, false);
});
