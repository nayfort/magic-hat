import { create } from "zustand";

interface IScoreState {
  score: {
    total: number;
    success: number;
    failed: number;
  };
  actions: {
    incrementSuccess: () => void;
    incrementFailed: () => void;
    resetScore: () => void;
  };
}

export const useScoreStore = create<IScoreState>((set) => ({
  score: {
    total: 0,
    success: 0,
    failed: 0,
  },
  actions: {
    incrementSuccess: () =>
      set(({ score }) => ({
        score: {
          ...score,
          total: score.total + 1,
          success: score.success + 1,
        },
      })),
    incrementFailed: () =>
      set(({ score }) => ({
        score: {
          ...score,
          total: score.total + 1,
          failed: score.failed + 1,
        },
      })),
    resetScore: () => set({ score: { total: 0, success: 0, failed: 0 } }),
  },
}));

export const useScore = () => useScoreStore((state) => state.score);
export const useScoreActions = () => useScoreStore((state) => state.actions);
