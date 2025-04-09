"use client";

import { useEffect, useState } from "react";
import { useTimerStore, TimerMode } from "../../store/timer-store";
import { ThemeSelector, Theme } from "../theme/theme-selector";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useBackgroundSound } from "@/hooks/use-background-sound";
import { Volume2, VolumeX } from "lucide-react";

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

  const { theme, setTheme } = useTheme();
  const { currentSound, setSound, volume, setVolume, isPlaying, togglePlay } =
    useBackgroundSound();

  const [pomodoroMinutes, setPomodoroMinutes] = useState(pomodoroTime / 60);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(
    shortBreakTime / 60
  );
  const [longBreakMinutes, setLongBreakMinutes] = useState(longBreakTime / 60);
  const [intervalCount, setIntervalCount] = useState(longBreakInterval);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    (theme as Theme) || "system"
  );
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);

  // Reset form values when modal opens
  useEffect(() => {
    if (isOpen) {
      setPomodoroMinutes(pomodoroTime / 60);
      setShortBreakMinutes(shortBreakTime / 60);
      setLongBreakMinutes(longBreakTime / 60);
      setIntervalCount(longBreakInterval);
      setSelectedTheme((theme as Theme) || "system");
    }
  }, [
    isOpen,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    longBreakInterval,
    theme,
  ]);

  function handleSave() {
    const timerStore = useTimerStore.getState();

    useTimerStore.setState({
      pomodoroTime: pomodoroMinutes * 60,
      shortBreakTime: shortBreakMinutes * 60,
      longBreakTime: longBreakMinutes * 60,
      longBreakInterval: intervalCount,
    });

    setTheme(selectedTheme);
    setMode(timerStore.mode as TimerMode);
    onClose();
  }

  function handleSoundChange(value: string) {
    setSound(value as "rain" | "forest" | "coffee" | null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Timer (minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pomodoro">Pomodoro</Label>
                <Input
                  id="pomodoro"
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroMinutes}
                  onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortBreak">Short Break</Label>
                <Input
                  id="shortBreak"
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakMinutes}
                  onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longBreak">Long Break</Label>
                <Input
                  id="longBreak"
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakMinutes}
                  onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <ThemeSelector value={selectedTheme} onChange={setSelectedTheme} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoStart"
              checked={autoStartBreaks}
              onCheckedChange={(checked) =>
                setAutoStartBreaks(checked as boolean)
              }
            />
            <Label htmlFor="autoStart">Auto start next break?</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval">Long Break Interval</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="interval"
                type="number"
                min="1"
                max="10"
                value={intervalCount}
                onChange={(e) => setIntervalCount(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">pomodoros</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sound">Background Sound</Label>
              <Select
                value={currentSound || undefined}
                onValueChange={handleSoundChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a background sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rain">Rain</SelectItem>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="coffee">Coffee Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentSound && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Volume</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Slider
                  value={[volume * 100]}
                  onValueChange={([value]) => setVolume(value / 100)}
                  max={100}
                  step={1}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
