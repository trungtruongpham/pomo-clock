"use client";

import { useEffect, useState } from "react";
import { useTimerStore, TimerMode } from "../../store/timer-store";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useBackgroundSound } from "@/hooks/use-background-sound";
import {
  Timer,
  Sun,
  Moon,
  Laptop,
  Volume2,
  VolumeX,
  Music,
  Settings,
  Repeat,
  CloudRain,
  TreePine,
  Coffee,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS = [
  { value: "light" as Theme, label: "Light", icon: Sun },
  { value: "dark" as Theme, label: "Dark", icon: Moon },
  { value: "system" as Theme, label: "System", icon: Laptop },
];

const SOUND_OPTIONS = [
  { value: "rain", label: "Rain", icon: CloudRain },
  { value: "forest", label: "Forest", icon: TreePine },
  { value: "coffee", label: "Coffee Shop", icon: Coffee },
];

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
    if (value === "none") {
      setSound(null);
    } else {
      setSound(value as "rain" | "forest" | "coffee");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Settings
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Customize your focus experience
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Timer Settings */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Timer className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Timer Duration
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label
                  htmlFor="pomodoro"
                  className="text-xs text-muted-foreground"
                >
                  Focus
                </Label>
                <div className="relative">
                  <Input
                    id="pomodoro"
                    type="number"
                    min="1"
                    max="60"
                    value={pomodoroMinutes}
                    onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                    className="pr-10 text-center font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    min
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="shortBreak"
                  className="text-xs text-muted-foreground"
                >
                  Short Break
                </Label>
                <div className="relative">
                  <Input
                    id="shortBreak"
                    type="number"
                    min="1"
                    max="30"
                    value={shortBreakMinutes}
                    onChange={(e) =>
                      setShortBreakMinutes(Number(e.target.value))
                    }
                    className="pr-10 text-center font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    min
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="longBreak"
                  className="text-xs text-muted-foreground"
                >
                  Long Break
                </Label>
                <div className="relative">
                  <Input
                    id="longBreak"
                    type="number"
                    min="1"
                    max="60"
                    value={longBreakMinutes}
                    onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
                    className="pr-10 text-center font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    min
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Theme */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-foreground">Theme</h3>
            </div>
            <div className="flex gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedTheme(option.value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
                    "border transition-all duration-200 cursor-pointer",
                    selectedTheme === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:bg-accent/50"
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Automation */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Repeat className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Automation
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Auto-start breaks
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Automatically start break after focus session
                  </p>
                </div>
                <Switch
                  checked={autoStartBreaks}
                  onCheckedChange={setAutoStartBreaks}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Long break interval
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Take a long break after X focus sessions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    max="10"
                    value={intervalCount}
                    onChange={(e) => setIntervalCount(Number(e.target.value))}
                    className="w-16 text-center font-medium"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Sound */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-4 h-4 text-violet-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Background Sound
              </h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleSoundChange("none")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl",
                    "border transition-all duration-200 cursor-pointer",
                    !currentSound
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border hover:bg-accent/50 text-muted-foreground"
                  )}
                >
                  <VolumeX className="w-5 h-5" />
                  <span className="text-xs font-medium">None</span>
                </button>
                {SOUND_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSoundChange(option.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-xl",
                      "border transition-all duration-200 cursor-pointer",
                      currentSound === option.value
                        ? "bg-violet-500/10 border-violet-500 text-violet-500"
                        : "bg-card border-border hover:bg-accent/50 text-muted-foreground"
                    )}
                  >
                    <option.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                ))}
              </div>

              {currentSound && (
                <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      Volume
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Volume2 className="h-4 w-4 text-violet-500" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <Slider
                    value={[volume * 100]}
                    onValueChange={([value]) => setVolume(value / 100)}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {Math.round(volume * 100)}%
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
