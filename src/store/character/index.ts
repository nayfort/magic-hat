import { create } from "zustand";

import {
  GuessResult,
  ICharacter,
  TCharacterHouse,
  TCharacterId,
} from "@/types";
import { characterService } from "@/services";
import { HARRY_POTTER } from "@/constants";

interface ICharacterStore {
  activeCharacter: ICharacter;
  characterIds: TCharacterId[];
  guessedCharacters: ICharacter[];
  actions: {
    getCharacterIds: () => void;
    getRandomCharacter: () => Promise<void>;
    guessCharacterHouse: (house: TCharacterHouse) => GuessResult;
    resetGuessedCharacters: () => void;
    setActiveCharacter: (character: ICharacter) => void;
  };
}

const useCharacterStore = create<ICharacterStore>((set, get) => ({
  activeCharacter: { ...HARRY_POTTER },
  characterIds: [],
  guessedCharacters: [],
  actions: {
    getCharacterIds: async () => {
      const characters = await characterService.fetchAll();
      const ids = characters.map((c) => c.id);
      set({ characterIds: ids });
    },
    getRandomCharacter: async () => {
      let character = HARRY_POTTER;
      const ids = get().characterIds;

      if (ids.length) {
        const randomIndex = Math.floor(Math.random() * ids.length);
        const id = ids[randomIndex];
        character = await characterService.fetchById(id);
      }

      set({ activeCharacter: character });
    },
    guessCharacterHouse: (house: TCharacterHouse) => {
      const activeCharacter = get().activeCharacter;
      const guessedCharacters = get().guessedCharacters;

      const character =
        guessedCharacters.find((c) => c.id === activeCharacter.id) ??
        activeCharacter;

      if (character.isGuessed) {
        return GuessResult.ALREADY_GUESSED;
      } else if (!character.attempts) {
        character.attempts = 1;
      } else {
        character.attempts += 1;
      }

      const isGuessed = character?.house === house;
      character.isGuessed = isGuessed;

      const index = guessedCharacters.findIndex((c) => c.id === character.id);
      const updatedGuessedCharacters =
        index > -1
          ? guessedCharacters.toSpliced(index, 1, character)
          : [...guessedCharacters, character];

      set({ guessedCharacters: updatedGuessedCharacters });

      return isGuessed ? GuessResult.SUCCESS : GuessResult.FAILED;
    },
    resetGuessedCharacters: () =>
      set({ activeCharacter: { ...HARRY_POTTER }, guessedCharacters: [] }),
    setActiveCharacter: (character: ICharacter) =>
      set({ activeCharacter: character }),
  },
}));

export const useActiveCharacter = () =>
  useCharacterStore((state) => state.activeCharacter);
export const useGuessedCharacters = () =>
  useCharacterStore((state) => state.guessedCharacters);
export const useCharacterActions = () =>
  useCharacterStore((state) => state.actions);
