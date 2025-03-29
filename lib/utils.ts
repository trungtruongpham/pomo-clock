import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TimerMode } from "../store/timer-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export function getTimerBackground(mode: TimerMode): string {
  switch (mode) {
    case "pomodoro":
      return "bg-pomodoro";
    case "shortBreak":
      return "bg-shortbreak";
    case "longBreak":
      return "bg-longbreak";
    default:
      return "bg-pomodoro";
  }
}

export function getTimerDarkerBackground(mode: TimerMode): string {
  switch (mode) {
    case "pomodoro":
      return "bg-pomodoro-darker";
    case "shortBreak":
      return "bg-shortbreak-darker";
    case "longBreak":
      return "bg-longbreak-darker";
    default:
      return "bg-pomodoro-darker";
  }
}

export function getTimerLighterBackground(mode: TimerMode): string {
  switch (mode) {
    case "pomodoro":
      return "bg-pomodoro-lighter";
    case "shortBreak":
      return "bg-shortbreak-lighter";
    case "longBreak":
      return "bg-longbreak-lighter";
    default:
      return "bg-pomodoro-lighter";
  }
}
