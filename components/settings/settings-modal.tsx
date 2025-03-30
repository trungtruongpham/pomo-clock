"use client";

import { useState, useEffect, useRef } from "react";
import { useTimerStore, TimerMode } from "../../store/timer-store";
import { useThemeStore, Theme } from "../../store/theme-store";
import { ThemeSelector } from "../theme/theme-selector";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    longBreakInterval,
    setMode,
  } = useTimerStore();
  const { theme, setTheme } = useThemeStore();

  const modalRef = useRef<HTMLDivElement>(null);

  const [pomodoroMinutes, setPomodoroMinutes] = useState(pomodoroTime / 60);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(
    shortBreakTime / 60
  );
  const [longBreakMinutes, setLongBreakMinutes] = useState(longBreakTime / 60);
  const [intervalCount, setIntervalCount] = useState(longBreakInterval);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);

  // Reset form values when modal opens
  useEffect(() => {
    if (isOpen) {
      setPomodoroMinutes(pomodoroTime / 60);
      setShortBreakMinutes(shortBreakTime / 60);
      setLongBreakMinutes(longBreakTime / 60);
      setIntervalCount(longBreakInterval);
      setSelectedTheme(theme);
    }
  }, [
    isOpen,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    longBreakInterval,
    theme,
  ]);

  // Handle outside click to close modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  function handleSave() {
    // Here we would update the timer store with new values
    // For simplicity, we're just going to simulate a save action
    const timerStore = useTimerStore.getState();

    // Update timer settings in state
    useTimerStore.setState({
      pomodoroTime: pomodoroMinutes * 60,
      shortBreakTime: shortBreakMinutes * 60,
      longBreakTime: longBreakMinutes * 60,
      longBreakInterval: intervalCount,
    });

    // Update theme setting
    setTheme(selectedTheme);

    // Reset timer with new duration based on current mode
    setMode(timerStore.mode as TimerMode);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-background dark:bg-black border border-border dark:border-white/10 rounded-lg max-w-md w-full p-6 relative animate-in fade-in duration-200 shadow-lg dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/70 hover:text-foreground dark:text-white/60 dark:hover:text-white/90 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-foreground dark:text-white">
          Settings
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3 text-foreground dark:text-white/90">
              Timer (minutes)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-foreground/70 dark:text-white/60 block mb-2">
                  Pomodoro
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroMinutes}
                  onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                  className="w-full p-2 border border-border dark:border-white/10 bg-background dark:bg-black text-foreground dark:text-white rounded-md dark:focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-foreground/70 dark:text-white/60 block mb-2">
                  Short Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakMinutes}
                  onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
                  className="w-full p-2 border border-border dark:border-white/10 bg-background dark:bg-black text-foreground dark:text-white rounded-md dark:focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-foreground/70 dark:text-white/60 block mb-2">
                  Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakMinutes}
                  onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
                  className="w-full p-2 border border-border dark:border-white/10 bg-background dark:bg-black text-foreground dark:text-white rounded-md dark:focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-foreground dark:text-white/90">
              Theme
            </h3>
            <ThemeSelector value={selectedTheme} onChange={setSelectedTheme} />
          </div>

          <div>
            <h3 className="font-medium mb-3 text-foreground dark:text-white/90">
              Auto Start Breaks
            </h3>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-foreground">Auto start next break?</span>
            </label>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-foreground dark:text-white/90">
              Long Break Interval
            </h3>
            <input
              type="number"
              min="1"
              max="10"
              value={intervalCount}
              onChange={(e) => setIntervalCount(Number(e.target.value))}
              className="w-24 p-2 border border-border dark:border-white/10 bg-background dark:bg-black text-foreground dark:text-white rounded-md dark:focus:border-white/30 transition-colors"
            />
            <span className="ml-2 text-sm text-foreground/70 dark:text-white/60">
              pomodoros
            </span>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-foreground dark:text-white/90">
              Alarm Sound
            </h3>
            <select className="w-full p-2 border border-border dark:border-white/10 bg-background dark:bg-black text-foreground dark:text-white rounded-md dark:focus:border-white/30 transition-colors">
              <option>Kitchen Timer</option>
              <option>Bell</option>
              <option>Digital Alarm</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-primary-foreground dark:bg-white dark:text-black rounded-md hover:bg-primary/90 dark:hover:bg-white/90 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
