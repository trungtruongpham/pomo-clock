import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Milestone {
  id: string;
  label: string;
  targetPomodoros: number;
  icon: string;
}

export const PRESET_MILESTONES: Milestone[] = [
  { id: "quick", label: "Quick Focus", targetPomodoros: 1, icon: "⚡" },
  { id: "standard", label: "Deep Work", targetPomodoros: 4, icon: "🎯" },
  { id: "marathon", label: "Marathon", targetPomodoros: 8, icon: "🏃" },
  { id: "custom", label: "Custom Goal", targetPomodoros: 0, icon: "✨" },
];

interface MilestoneState {
  activeMilestone: Milestone | null;
  customTarget: number;
  completedPomodoros: number;
  dailyStreak: number;
  totalFocusMinutes: number;

  // Actions
  setMilestone: (milestone: Milestone) => void;
  setCustomTarget: (target: number) => void;
  incrementCompleted: () => void;
  resetSession: () => void;
  addFocusMinutes: (minutes: number) => void;
}

export const useMilestoneStore = create<MilestoneState>()(
  persist(
    (set, get) => ({
      activeMilestone: null,
      customTarget: 6,
      completedPomodoros: 0,
      dailyStreak: 0,
      totalFocusMinutes: 0,

      setMilestone: (milestone) =>
        set({
          activeMilestone: milestone,
          completedPomodoros: 0,
        }),

      setCustomTarget: (target) => set({ customTarget: target }),

      incrementCompleted: () =>
        set((state) => ({
          completedPomodoros: state.completedPomodoros + 1,
        })),

      resetSession: () =>
        set({
          activeMilestone: null,
          completedPomodoros: 0,
        }),

      addFocusMinutes: (minutes) =>
        set((state) => ({
          totalFocusMinutes: state.totalFocusMinutes + minutes,
        })),
    }),
    {
      name: "pomostudy-milestones",
    }
  )
);
