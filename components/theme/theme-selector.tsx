"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Theme = "light" | "dark" | "system";

interface ThemeSelectorProps {
  value?: Theme;
  onChange?: (theme: Theme) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun size={18} /> },
    { value: "dark", label: "Dark", icon: <Moon size={18} /> },
    { value: "system", label: "System", icon: <Laptop size={18} /> },
  ];

  const handleThemeChange = (newTheme: Theme) => {
    if (onChange) {
      onChange(newTheme);
    } else {
      setTheme(newTheme);
    }
  };

  const activeTheme = value || (theme as Theme) || "system";

  return (
    <div className="flex space-x-2 md:space-x-4">
      {themes.map((themeOption) => (
        <Button
          key={themeOption.value}
          onClick={() => handleThemeChange(themeOption.value)}
          variant={activeTheme === themeOption.value ? "default" : "outline"}
          size="sm"
          className="flex items-center justify-center"
        >
          <span className="mr-2">{themeOption.icon}</span>
          <span className="text-sm font-medium">{themeOption.label}</span>
        </Button>
      ))}
    </div>
  );
}
