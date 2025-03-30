"use client";

import { useEffect } from "react";
import {
  formatTime,
  getTimerBackground,
  getTimerDarkerBackground,
} from "@/lib/utils";
import { TimerMode, useTimerStore } from "@/store/timer-store";
import { useTaskStore } from "@/store/task-store";
import { cn } from "@/lib/utils";

interface TimerProps {
  focusMode?: boolean;
}

export function Timer({ focusMode = false }: TimerProps) {
  const {
    mode,
    timeLeft,
    isRunning,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    completePomo,
  } = useTimerStore();

  const { tasks, incrementCompletedPomodoros } = useTaskStore();
  const activeTask = tasks.find((task) => task.isActive);

  // Handle timer ticking
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer completed
      if (mode === "pomodoro") {
        // If pomodoro completed and there's an active task, increment its count
        if (activeTask) {
          incrementCompletedPomodoros(activeTask.id);
        }
        completePomo();
        playAlarmSound();
      } else {
        // Break completed, switch back to pomodoro
        setMode("pomodoro");
        playAlarmSound();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isRunning,
    timeLeft,
    mode,
    tick,
    completePomo,
    setMode,
    activeTask,
    incrementCompletedPomodoros,
  ]);

  function handleStartPause() {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function playAlarmSound() {
    const audio = new Audio("/alarm.mp3");
    audio.play();
  }

  return (
    <div
      className={cn(
        `w-full rounded-lg ${getTimerBackground(mode)} text-white shadow-2xl`,
        focusMode && "p-3 sm:p-6 transform transition-all duration-300"
      )}
    >
      <div className="mx-auto p-3 sm:p-4">
        <div className="flex justify-center mb-4 sm:mb-8">
          <TimerModeTabs currentMode={mode} onModeChange={setMode} />
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h2
            className={cn(
              "text-6xl sm:text-7xl md:text-8xl font-bold mb-2",
              focusMode && "text-7xl sm:text-8xl md:text-9xl"
            )}
          >
            {formatTime(timeLeft)}
          </h2>
        </div>

        <div className="flex justify-center space-x-3 sm:space-x-4">
          <button
            onClick={handleStartPause}
            className={cn(
              `rounded-md px-6 sm:px-8 py-2 text-lg sm:text-xl font-bold ${getTimerDarkerBackground(
                mode
              )} hover:opacity-90 transition-opacity`,
              focusMode && "px-8 sm:px-10 py-2 sm:py-3 text-xl sm:text-2xl"
            )}
          >
            {isRunning ? "PAUSE" : "START"}
          </button>

          {isRunning && (
            <button
              onClick={resetTimer}
              className="rounded-md px-3 sm:px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              RESET
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TimerModeTabs({
  currentMode,
  onModeChange,
}: {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}) {
  return (
    <div className="flex rounded-full bg-white/20 p-1 text-xs sm:text-sm">
      <button
        className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium ${
          currentMode === "pomodoro" ? "bg-white/30" : ""
        }`}
        onClick={() => onModeChange("pomodoro")}
      >
        Pomodoro
      </button>
      <button
        className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium ${
          currentMode === "shortBreak" ? "bg-white/30" : ""
        }`}
        onClick={() => onModeChange("shortBreak")}
      >
        Short Break
      </button>
      <button
        className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium ${
          currentMode === "longBreak" ? "bg-white/30" : ""
        }`}
        onClick={() => onModeChange("longBreak")}
      >
        Long Break
      </button>
    </div>
  );
}
