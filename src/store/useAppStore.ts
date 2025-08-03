import { create } from 'zustand';

type TimeRange = {
  start: Date;
  end: Date;
};

type AppState = {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
};

export const useAppStore = create<AppState>((set) => ({
  timeRange: {
    start: new Date(), 
    end: new Date(),
  },
  setTimeRange: (range) => set({ timeRange: range }),
}));
