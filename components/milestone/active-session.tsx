"use client"

import { motion } from "framer-motion"
import { X, RotateCcw, Trophy, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Milestone, useMilestoneStore } from "@/store/milestone-store"
import { ProgressRing } from "./progress-ring"
import { cn } from "@/lib/utils"

interface ActiveSessionProps {
  milestone: Milestone
  completedPomodoros: number
  onReset: () => void
}

export function ActiveSession({ milestone, completedPomodoros, onReset }: ActiveSessionProps) {
  const targetPomodoros = milestone.id === "custom" 
    ? useMilestoneStore.getState().customTarget 
    : milestone.targetPomodoros

  const progress = Math.min(completedPomodoros / targetPomodoros, 1)
  const isComplete = completedPomodoros >= targetPomodoros
  const remaining = Math.max(0, targetPomodoros - completedPomodoros)

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Session Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg",
            "bg-gradient-to-br from-rose-500/20 to-red-500/20"
          )}>
            <Flame className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{milestone.label}</h3>
            <p className="text-sm text-muted-foreground">
              {isComplete ? "Goal achieved!" : `${remaining} ${remaining === 1 ? "pomodoro" : "pomodoros"} to go`}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        {isComplete ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20"
          >
            <Trophy className="w-16 h-16 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-1">
              Goal Complete!
            </h3>
            <p className="text-muted-foreground text-center">
              You completed {completedPomodoros} pomodoros. Great job!
            </p>
            <Button
              onClick={onReset}
              variant="outline"
              className="mt-4"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Session
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Progress dots */}
            <div className="flex items-center gap-2 flex-wrap justify-center max-w-[280px]">
              {Array.from({ length: targetPomodoros }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all duration-300",
                    index < completedPomodoros
                      ? "bg-gradient-to-br from-rose-500 to-red-500 shadow-lg shadow-rose-500/30"
                      : "bg-muted/50 border border-muted-foreground/20"
                  )}
                />
              ))}
            </div>

            {/* Progress text */}
            <div className="mt-4 text-center">
              <span className="text-3xl font-bold text-foreground">
                {completedPomodoros}
              </span>
              <span className="text-xl text-muted-foreground">
                {" / "}{targetPomodoros}
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round(progress * 100)}% complete
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

