"use client";

import { useEffect } from "react";
import {
  formatTime,
  getTimerBackground,
  getTimerDarkerBackground,
} from "@/lib/utils";
import { TimerMode, useTimerStore } from "@/store/timer-store";
import { useTaskStore } from "@/store/task-store";

export function Timer() {
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
      className={`w-full rounded-lg  ${getTimerBackground(
        mode
      )} text-white shadow-2xl`}
    >
      <div className="mx-auto p-4">
        <div className="flex justify-center mb-8">
          <TimerModeTabs currentMode={mode} onModeChange={setMode} />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-8xl font-bold mb-2">{formatTime(timeLeft)}</h2>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartPause}
            className={`rounded-md px-8 py-2 text-xl font-bold ${getTimerDarkerBackground(
              mode
            )} hover:opacity-90 transition-opacity`}
          >
            {isRunning ? "PAUSE" : "START"}
          </button>

          {isRunning && (
            <button
              onClick={resetTimer}
              className="rounded-md px-4 py-2 text-white/70 hover:text-white transition-colors"
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
    <div className="flex rounded-full bg-white/20 p-1">
      <button
        className={`px-4 py-2 rounded-full text-sm font-semibold ${
          currentMode === "pomodoro" ? "bg-white/30" : ""
        }`}
        onClick={() => onModeChange("pomodoro")}
      >
        Pomodoro
      </button>
      <button
        className={`px-4 py-2 rounded-full text-sm font-semibold ${
          currentMode === "shortBreak" ? "bg-white/30" : ""
        }`}
        onClick={() => onModeChange("shortBreak")}
      >
        Short Break
      </button>
      <button
        className={`px-4 py-2 rounded-full text-sm font-semibold ${
          currentMode === "longBreak" ? "bg-white/30" : ""
        }`}
        onClick={() => onModeChange("longBreak")}
      >
        Long Break
      </button>
    </div>
  );
}
