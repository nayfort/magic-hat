import { create } from "zustand";
import { GuessResult, ICharacter, TCharacterHouse } from "@/types";
import { characterService } from "@/services";
import { HARRY_POTTER } from "@/constants/character";

interface ICharacterStore {
  activeCharacter: ICharacter;
  characters: ICharacter[];
  guessedCharacters: ICharacter[];
  isLoading: boolean;
  error: string | null;
  actions: {
    loadCharacters: () => Promise<void>;
    getRandomCharacter: () => void;
    guessCharacterHouse: (house: TCharacterHouse) => GuessResult;
    resetGuessedCharacters: () => void;
    setActiveCharacter: (character: ICharacter) => void;
  };
}

export const useCharacterStore = create<ICharacterStore>((set, get) => ({
  activeCharacter: { ...HARRY_POTTER },
  characters: [],
  guessedCharacters: [],
  isLoading: false,
  error: null,
  actions: {
    loadCharacters: async () => {
      if (get().isLoading) return;
      set({ isLoading: true, error: null });
      try {
        const characters = await characterService.fetchAll();
        set({ characters });
      } catch {
        set({
          error:
            "Unable to load characters. Check your connection and pull down to retry.",
        });
      } finally {
        set({ isLoading: false });
      }
    },
    getRandomCharacter: () => {
      const { characters, guessedCharacters, activeCharacter } = get();
      const remaining = characters.filter(
        (character) =>
          !guessedCharacters.some(
            (guess) => guess.id === character.id && guess.isGuessed,
          ),
      );
      const different = remaining.filter(
        (character) => character.id !== activeCharacter.id,
      );
      const pool = different.length ? different : remaining;
      if (!pool.length) return;
      const character = pool[Math.floor(Math.random() * pool.length)];
      set({
        activeCharacter: guessedCharacters.find(
          (guess) => guess.id === character.id,
        ) ?? { ...character },
      });
    },
    guessCharacterHouse: (house) => {
      const { activeCharacter, guessedCharacters } = get();
      const previous =
        guessedCharacters.find((c) => c.id === activeCharacter.id) ??
        activeCharacter;
      if (previous.isGuessed) return GuessResult.ALREADY_GUESSED;
      const character = {
        ...previous,
        attempts: (previous.attempts ?? 0) + 1,
        isGuessed: previous.house === house,
      };
      const exists = guessedCharacters.some((c) => c.id === character.id);
      set({
        activeCharacter: character,
        guessedCharacters: exists
          ? guessedCharacters.map((c) =>
              c.id === character.id ? character : c,
            )
          : [...guessedCharacters, character],
      });
      return character.isGuessed ? GuessResult.SUCCESS : GuessResult.FAILED;
    },
    resetGuessedCharacters: () =>
      set({ activeCharacter: { ...HARRY_POTTER }, guessedCharacters: [] }),
    setActiveCharacter: (character) => set({ activeCharacter: character }),
  },
}));

export const useActiveCharacter = () =>
  useCharacterStore((state) => state.activeCharacter);
export const useGuessedCharacters = () =>
  useCharacterStore((state) => state.guessedCharacters);
export const useCharacterActions = () =>
  useCharacterStore((state) => state.actions);
