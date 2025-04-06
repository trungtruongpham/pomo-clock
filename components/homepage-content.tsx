"use client";

import { useState } from "react";
import { TaskList } from "@/components/tasks/task-list";
import { Timer } from "./pomodoro/timer";
import { PomodoroExplanation } from "./explanation-card";
import { FocusMode } from "./focus-mode-switch";

export function HomepageContent() {
  const [focusModeActive, setFocusModeActive] = useState(false);

  return (
    <div
      className={`flex flex-col w-full mx-auto ${
        focusModeActive ? "overflow-hidden" : ""
      }`}
    >
      <header className="flex justify-end mb-4 mt-2">
        <FocusMode onChange={setFocusModeActive} />
      </header>

      {focusModeActive ? (
        <section
          className="flex justify-center items-center py-6 sm:py-10"
          aria-label="Focus Mode Timer"
        >
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
            <h1 className="sr-only">PomoClock - Pomodoro Timer for Focus</h1>
            <Timer focusMode={true} />
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <section
            className="flex flex-col gap-6 sm:gap-8 md:pr-4"
            aria-label="Pomodoro Timer Section"
          >
            <div className="w-full max-w-sm sm:max-w-md mx-auto md:mx-0">
              <h1 className="sr-only">
                PomoClock - Pomodoro Timer for Productivity
              </h1>
              <Timer />
            </div>
            <div className="w-full max-w-sm sm:max-w-md mx-auto md:mx-0">
              <PomodoroExplanation />
            </div>
          </section>

          <section
            className="w-full max-w-xl mx-auto md:mx-0"
            aria-label="Task Management Section"
          >
            <TaskList />
          </section>
        </div>
      )}
    </div>
  );
}
