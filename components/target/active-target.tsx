"use client";

import { motion } from "framer-motion";
import {
  X,
  BookOpen,
  Briefcase,
  Code,
  PenTool,
  Palette,
  Calendar,
  Flame,
  Clock,
  Music,
  Dumbbell,
  Heart,
  Lightbulb,
  Gamepad2,
  GraduationCap,
  Camera,
  Utensils,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Target } from "@/store/target-store";
import { cn } from "@/lib/utils";

interface ActiveTargetProps {
  target: Target;
  completedPomodoros: number;
  totalFocusMinutes: number;
  onClear: () => void;
}

const TARGET_ICONS: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Lightbulb: <Lightbulb className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Plane: <Plane className="w-5 h-5" />,
};

export function ActiveTarget({
  target,
  completedPomodoros,
  totalFocusMinutes,
  onClear,
}: ActiveTargetProps) {
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const remainingMinutes = Math.round(totalFocusMinutes % 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto mb-4"
    >
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl",
          "bg-card/50 backdrop-blur-sm border border-border/50"
        )}
      >
        {/* Target Icon */}
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg",
            "bg-gradient-to-br text-white",
            target.color
          )}
        >
          {TARGET_ICONS[target.icon] || <BookOpen className="w-5 h-5" />}
        </div>

        {/* Target Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate">
            {target.label}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" />
              {completedPomodoros}{" "}
              {completedPomodoros === 1 ? "session" : "sessions"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              {focusHours > 0 && `${focusHours}h `}
              {remainingMinutes}m focused
            </span>
          </div>
        </div>

        {/* Clear Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
