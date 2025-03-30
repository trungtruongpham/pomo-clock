"use client";

import { Theme } from "../../store/theme-store";
import { Sun, Moon, Laptop } from "lucide-react";

interface ThemeSelectorProps {
  value: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun size={18} /> },
    { value: "dark", label: "Dark", icon: <Moon size={18} /> },
    { value: "system", label: "System", icon: <Laptop size={18} /> },
  ];

  return (
    <div className="flex space-x-2 md:space-x-4">
      {themes.map((theme) => (
        <button
          key={theme.value}
          onClick={() => onChange(theme.value)}
          className={`flex items-center justify-center p-2 rounded-md transition-all ${
            value === theme.value
              ? "bg-primary text-primary-foreground dark:bg-white dark:text-black ring-2 ring-primary/30 dark:ring-white/30"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-black dark:text-white dark:border dark:border-white/10 dark:hover:border-white/30"
          }`}
        >
          <span className="mr-2">{theme.icon}</span>
          <span className="text-sm font-medium">{theme.label}</span>
        </button>
      ))}
    </div>
  );
}
