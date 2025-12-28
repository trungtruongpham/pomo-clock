"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Timer } from "./pomodoro/timer";
import { FocusMode } from "./focus-mode-switch";
import { TargetSelector } from "./target/target-selector";
import { ActiveTarget } from "./target/active-target";
import { Target, useTargetStore } from "@/store/target-store";
import { getTodayTargetSession } from "@/app/actions/target-actions";

export function HomepageContent() {
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dbSessionData, setDbSessionData] = useState<{
    completedPomodoros: number;
    totalFocusMinutes: number;
  } | null>(null);

  const {
    activeTarget,
    completedPomodoros: localCompletedPomodoros,
    totalFocusMinutes: localTotalFocusMinutes,
    setTarget,
    clearTarget,
    setCompletedPomodoros,
    setTotalFocusMinutes,
  } = useTargetStore();

  // Fetch target session data from database when target changes
  const fetchTargetSessionData = useCallback(
    async (targetId: string) => {
      const result = await getTodayTargetSession(targetId);
      if (result.success && result.data) {
        setDbSessionData({
          completedPomodoros: result.data.completed_pomodoros,
          totalFocusMinutes: result.data.total_focus_minutes,
        });
        // Sync with local store
        setCompletedPomodoros(result.data.completed_pomodoros);
        setTotalFocusMinutes(result.data.total_focus_minutes);
      } else {
        setDbSessionData(null);
      }
    },
    [setCompletedPomodoros, setTotalFocusMinutes]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data when active target changes
  useEffect(() => {
    if (activeTarget && mounted) {
      fetchTargetSessionData(activeTarget.id);
    }
  }, [activeTarget, mounted, fetchTargetSessionData]);

  // Calculate display values - prefer database data, fallback to local
  const displayCompletedPomodoros =
    dbSessionData?.completedPomodoros ?? localCompletedPomodoros;
  const displayTotalFocusMinutes =
    dbSessionData?.totalFocusMinutes ?? localTotalFocusMinutes;

  function handleTargetSelect(target: Target) {
    setTarget(target);
  }

  function handleClearTarget() {
    clearTarget();
    setDbSessionData(null);
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] justify-center mx-auto">
        <div className="flex justify-center items-center py-6 sm:py-10">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto px-4">
            <div className="animate-pulse bg-muted rounded-lg h-[300px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col w-full min-h-[calc(100vh-4rem)] justify-center mx-auto px-4 ${
        focusModeActive ? "overflow-hidden" : ""
      }`}
    >
      {/* Focus Mode Toggle */}
      <header className="flex justify-end mb-4 mt-2">
        <FocusMode onChange={setFocusModeActive} />
      </header>

      {focusModeActive ? (
        /* Focus Mode - Full screen timer only */
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
        /* Regular Mode - Timer with Target */
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTarget ? "with-target" : "no-target"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6 py-6"
          >
            {/* Active Target Display (if selected) */}
            {activeTarget && (
              <ActiveTarget
                target={activeTarget}
                completedPomodoros={displayCompletedPomodoros}
                totalFocusMinutes={displayTotalFocusMinutes}
                onClear={handleClearTarget}
              />
            )}

            {/* Timer - Always visible and centered */}
            <section
              className="w-full max-w-sm sm:max-w-md mx-auto"
              aria-label="Pomodoro Timer"
            >
              <h1 className="sr-only">
                PomoClock - Pomodoro Timer for Productivity
              </h1>
              <Timer />
            </section>

            {/* Target Selector (if no target selected) */}
            {!activeTarget && (
              <section
                className="w-full mt-4"
                aria-label="Choose Your Focus Target"
              >
                <TargetSelector onSelect={handleTargetSelect} />
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
