"use client";

import { useState, useEffect } from "react";
import { useTimerStore, TimerMode } from "../../store/timer-store";
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

  const [pomodoroMinutes, setPomodoroMinutes] = useState(pomodoroTime / 60);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(
    shortBreakTime / 60
  );
  const [longBreakMinutes, setLongBreakMinutes] = useState(longBreakTime / 60);
  const [intervalCount, setIntervalCount] = useState(longBreakInterval);

  // Reset form values when modal opens
  useEffect(() => {
    if (isOpen) {
      setPomodoroMinutes(pomodoroTime / 60);
      setShortBreakMinutes(shortBreakTime / 60);
      setLongBreakMinutes(longBreakTime / 60);
      setIntervalCount(longBreakInterval);
    }
  }, [isOpen, pomodoroTime, shortBreakTime, longBreakTime, longBreakInterval]);

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

    // Reset timer with new duration based on current mode
    setMode(timerStore.mode as TimerMode);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6">Settings</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Timer (minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  Pomodoro
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroMinutes}
                  onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  Short Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakMinutes}
                  onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakMinutes}
                  onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Auto Start Breaks</h3>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Auto start next break?</span>
            </label>
          </div>

          <div>
            <h3 className="font-medium mb-3">Long Break Interval</h3>
            <input
              type="number"
              min="1"
              max="10"
              value={intervalCount}
              onChange={(e) => setIntervalCount(Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded-md"
            />
            <span className="ml-2 text-sm text-gray-600">pomodoros</span>
          </div>

          <div>
            <h3 className="font-medium mb-3">Alarm Sound</h3>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>Kitchen Timer</option>
              <option>Bell</option>
              <option>Digital Alarm</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
