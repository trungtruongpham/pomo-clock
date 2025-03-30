"use client";

import { useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { EyeOff } from "lucide-react";

interface FocusModeProps {
  onChange: (focused: boolean) => void;
}

export function FocusMode({ onChange }: FocusModeProps) {
  const [focused, setFocused] = useState(false);

  const toggleFocus = () => {
    const newFocused = !focused;
    setFocused(newFocused);
    onChange(newFocused);
  };

  return (
    <div className="flex items-center space-x-2 p-1 rounded-full bg-black/5 dark:bg-white/5">
      <Switch
        id="focus-mode"
        checked={focused}
        onCheckedChange={toggleFocus}
        className="data-[state=checked]:bg-pomodoro"
      />
      <Label
        htmlFor="focus-mode"
        className="flex items-center text-sm gap-1.5 cursor-pointer pr-2 py-1"
      >
        <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="text-xs sm:text-sm">Focus Mode</span>
      </Label>
    </div>
  );
}
