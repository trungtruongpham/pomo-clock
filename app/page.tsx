"use client";

import { useState } from "react";
import { TaskList } from "@/components/tasks/task-list";
import { Timer } from "../components/pomodoro/timer";
import { PomodoroExplanation } from "@/components/explanation-card";
import { FocusMode } from "@/components/focus-mode-switch";

export default function Home() {
  const [focusModeActive, setFocusModeActive] = useState(false);

  return (
    <div className="flex flex-col w-full mx-auto">
      <div className="flex justify-end mb-4 mt-2">
        <FocusMode onChange={setFocusModeActive} />
      </div>

      {focusModeActive ? (
        <div className="flex justify-center items-center py-6 sm:py-10">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
            <Timer focusMode={true} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="flex flex-col gap-6 sm:gap-8 md:pr-4">
            <div className="w-full max-w-sm sm:max-w-md mx-auto md:mx-0">
              <Timer />
            </div>
            <div className="w-full max-w-sm sm:max-w-md mx-auto md:mx-0">
              <PomodoroExplanation />
            </div>
          </div>

          <div className="w-full max-w-xl mx-auto md:mx-0">
            <TaskList />
          </div>
        </div>
      )}
    </div>
  );
}
