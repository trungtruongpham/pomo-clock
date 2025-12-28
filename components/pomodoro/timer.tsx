"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime } from "@/lib/utils";
import { TimerMode, useTimerStore } from "@/store/timer-store";
import { useTargetStore } from "@/store/target-store";
import { savePomodorSession } from "@/app/actions/pomodoro-actions";
import { saveTargetSession } from "@/app/actions/target-actions";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Timer as TimerIcon, Coffee, Sunset } from "lucide-react";

interface TimerProps {
  focusMode?: boolean;
}

const MODE_CONFIG = {
  pomodoro: {
    label: "Focus",
    icon: TimerIcon,
    gradient: "from-rose-500 to-red-500",
    ringColor: "stroke-rose-500",
    bgLight: "bg-rose-50 dark:bg-rose-500/10",
    textColor: "text-rose-500",
    bgCircle: "bg-rose-100/80 dark:bg-rose-950/30",
    borderCircle: "border-rose-200 dark:border-rose-500/20",
    trackColor: "stroke-rose-200 dark:stroke-rose-500/20",
  },
  shortBreak: {
    label: "Short Break",
    icon: Coffee,
    gradient: "from-emerald-500 to-teal-500",
    ringColor: "stroke-emerald-500",
    bgLight: "bg-emerald-50 dark:bg-emerald-500/10",
    textColor: "text-emerald-500",
    bgCircle: "bg-emerald-100/80 dark:bg-emerald-950/30",
    borderCircle: "border-emerald-200 dark:border-emerald-500/20",
    trackColor: "stroke-emerald-200 dark:stroke-emerald-500/20",
  },
  longBreak: {
    label: "Long Break",
    icon: Sunset,
    gradient: "from-blue-500 to-indigo-500",
    ringColor: "stroke-blue-500",
    bgLight: "bg-blue-50 dark:bg-blue-500/10",
    textColor: "text-blue-500",
    bgCircle: "bg-blue-100/80 dark:bg-blue-950/30",
    borderCircle: "border-blue-200 dark:border-blue-500/20",
    trackColor: "stroke-blue-200 dark:stroke-blue-500/20",
  },
};

export function Timer({ focusMode = false }: TimerProps) {
  const {
    mode,
    timeLeft,
    isRunning,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    completePomo,
  } = useTimerStore();

  const { activeTarget, incrementCompleted, addFocusMinutes } = useTargetStore();

  // Get total time based on mode
  const totalTime = mode === "pomodoro" 
    ? pomodoroTime 
    : mode === "shortBreak" 
      ? shortBreakTime 
      : longBreakTime;

  // Calculate progress (0 to 1)
  const progress = 1 - timeLeft / totalTime;
  const config = MODE_CONFIG[mode];

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
        const focusMinutes = pomodoroTime / 60;
        
        // If there's an active target, increment completed count and save to database
        if (activeTarget) {
          incrementCompleted();
          addFocusMinutes(focusMinutes);
          
          // Save target session to database
          saveTargetSession({
            target_id: activeTarget.id,
            target_label: activeTarget.label,
            target_icon: activeTarget.icon,
            target_color: activeTarget.color,
            focus_minutes: focusMinutes,
          });
        }

        // Save the completed pomodoro session to Supabase
        const durationInSeconds = pomodoroTime;
        savePomodorSession({
          duration: durationInSeconds,
          completed_at: new Date(),
        });

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
    pomodoroTime,
    tick,
    completePomo,
    setMode,
    activeTarget,
    incrementCompleted,
    addFocusMinutes,
  ]);

  function handleStartPause() {
    if (isRunning) {
      pauseTimer();
    } else {
      playClickSound();
      startTimer();
    }
  }

  function playAlarmSound() {
    const audio = new Audio("/click.mp3");
    audio.play();
  }

  function playClickSound() {
    const audio = new Audio("/click.mp3");
    audio.play();
  }

  // Circular progress calculations
  const size = focusMode ? 320 : 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <div className="w-full">
      {/* Mode Tabs */}
      <div className="flex justify-center mb-6">
        <TimerModeTabs currentMode={mode} onModeChange={setMode} isRunning={isRunning} />
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Background glow - more visible in light mode */}
          <div
            className={cn(
              "absolute inset-0 rounded-full blur-3xl",
              "opacity-30 dark:opacity-20",
              `bg-gradient-to-br ${config.gradient}`
            )}
          />

          {/* Solid background circle for visibility */}
          <div
            className={cn(
              "absolute inset-2 rounded-full",
              "border-2 shadow-inner",
              config.bgCircle,
              config.borderCircle
            )}
          />

          {/* SVG Circle */}
          <svg
            width={size}
            height={size}
            className="transform -rotate-90 relative z-10"
          >
            {/* Background track circle - colored based on mode */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              className={config.trackColor}
            />
            {/* Progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              className={config.ringColor}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                {/* Mode icon */}
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-10 h-10 rounded-full mb-2",
                    config.bgLight
                  )}
                >
                  <config.icon className={cn("w-5 h-5", config.textColor)} />
                </div>

                {/* Time display */}
                <motion.h2
                  key={timeLeft}
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "font-bold text-foreground tabular-nums tracking-tight",
                    focusMode ? "text-7xl sm:text-8xl" : "text-6xl sm:text-7xl"
                  )}
                >
                  {formatTime(timeLeft)}
                </motion.h2>

                {/* Mode label */}
                <p className={cn("text-sm font-medium mt-1", config.textColor)}>
                  {config.label}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {/* Reset button (only when running) */}
        <AnimatePresence>
          {isRunning && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={resetTimer}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full",
                "bg-muted/50 hover:bg-muted",
                "transition-colors duration-200 cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
            >
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Main Start/Pause button */}
        <motion.button
          onClick={handleStartPause}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center justify-center gap-2",
            "px-8 py-4 rounded-full font-semibold text-lg",
            "text-white shadow-lg cursor-pointer",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
            `bg-gradient-to-r ${config.gradient}`,
            `hover:shadow-xl hover:shadow-${mode === "pomodoro" ? "rose" : mode === "shortBreak" ? "emerald" : "blue"}-500/25`,
            focusMode && "px-10 py-5 text-xl"
          )}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

function TimerModeTabs({
  currentMode,
  onModeChange,
  isRunning,
}: {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
  isRunning: boolean;
}) {
  const modes: { value: TimerMode; label: string; icon: React.ElementType }[] = [
    { value: "pomodoro", label: "Focus", icon: TimerIcon },
    { value: "shortBreak", label: "Short", icon: Coffee },
    { value: "longBreak", label: "Long", icon: Sunset },
  ];

  return (
    <div className="inline-flex rounded-full bg-muted/50 p-1 border border-border/50">
      {modes.map((modeItem) => {
        const isActive = currentMode === modeItem.value;
        const config = MODE_CONFIG[modeItem.value];

        return (
          <button
            key={modeItem.value}
            onClick={() => onModeChange(modeItem.value)}
            disabled={isRunning}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium",
              "transition-all duration-200 cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isActive
                ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <modeItem.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{modeItem.label}</span>
          </button>
        );
      })}
    </div>
  );
}
