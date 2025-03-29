import { create } from "zustand";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  pomodorosCompleted: number;

  // Timer settings
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number;

  // Actions
  setMode: (mode: TimerMode) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completePomo: () => void;
  setTimeLeft: (time: number) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  mode: "pomodoro",
  timeLeft: 25 * 60, // 25 minutes in seconds
  isRunning: false,
  pomodorosCompleted: 0,

  // Default timer settings
  pomodoroTime: 25 * 60, // 25 minutes in seconds
  shortBreakTime: 5 * 60, // 5 minutes in seconds
  longBreakTime: 15 * 60, // 15 minutes in seconds
  longBreakInterval: 4, // Long break after 4 pomodoros

  // Actions
  setMode: (mode) =>
    set((state) => {
      let newTimeLeft = state.timeLeft;

      switch (mode) {
        case "pomodoro":
          newTimeLeft = state.pomodoroTime;
          break;
        case "shortBreak":
          newTimeLeft = state.shortBreakTime;
          break;
        case "longBreak":
          newTimeLeft = state.longBreakTime;
          break;
      }

      return { mode, timeLeft: newTimeLeft, isRunning: false };
    }),

  startTimer: () => set({ isRunning: true }),

  pauseTimer: () => set({ isRunning: false }),

  resetTimer: () =>
    set((state) => {
      let newTimeLeft = state.pomodoroTime;

      switch (state.mode) {
        case "pomodoro":
          newTimeLeft = state.pomodoroTime;
          break;
        case "shortBreak":
          newTimeLeft = state.shortBreakTime;
          break;
        case "longBreak":
          newTimeLeft = state.longBreakTime;
          break;
      }

      return { timeLeft: newTimeLeft, isRunning: false };
    }),

  tick: () =>
    set((state) => ({
      timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0,
    })),

  completePomo: () =>
    set((state) => {
      const newCount = state.pomodorosCompleted + 1;
      const shouldTakeLongBreak = newCount % state.longBreakInterval === 0;

      return {
        pomodorosCompleted: newCount,
        mode: shouldTakeLongBreak ? "longBreak" : "shortBreak",
        timeLeft: shouldTakeLongBreak
          ? state.longBreakTime
          : state.shortBreakTime,
        isRunning: false,
      };
    }),

  setTimeLeft: (time) => set({ timeLeft: time }),
}));
