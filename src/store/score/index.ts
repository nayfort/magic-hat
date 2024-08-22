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

const useScoreStore = create<IScoreState>((set) => ({
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
          total: ++score.total,
          success: ++score.success,
        },
      })),
    incrementFailed: () =>
      set(({ score }) => ({
        score: {
          ...score,
          total: ++score.total,
          failed: ++score.failed,
        },
      })),
    resetScore: () => set({ score: { total: 0, success: 0, failed: 0 } }),
  },
}));

export const useScore = () => useScoreStore((state) => state.score);
export const useScoreActions = () => useScoreStore((state) => state.actions);
