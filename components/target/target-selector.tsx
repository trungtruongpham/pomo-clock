"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Briefcase,
  Code,
  PenTool,
  Palette,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { PRESET_TARGETS, Target } from "@/store/target-store"
import { cn } from "@/lib/utils"

interface TargetSelectorProps {
  onSelect: (target: Target) => void
}

const TARGET_ICONS: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  PenTool: <PenTool className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
}

export function TargetSelector({ onSelect }: TargetSelectorProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          What are you focusing on?
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose your target to start your focus session
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PRESET_TARGETS.map((target, index) => (
          <motion.button
            key={target.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(target)}
            className={cn(
              "group relative flex flex-col items-center gap-3 p-4 rounded-xl",
              "bg-card border border-border",
              "hover:border-primary/50 hover:bg-accent/50",
              "transition-all duration-200 cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl",
                "bg-gradient-to-br text-white",
                target.color
              )}
            >
              {TARGET_ICONS[target.icon]}
            </div>

            <div className="text-center">
              <span className="font-semibold text-foreground text-sm block">
                {target.label}
              </span>
              <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                {target.description}
              </p>
            </div>

            {/* Hover indicator */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/30 transition-colors pointer-events-none" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

