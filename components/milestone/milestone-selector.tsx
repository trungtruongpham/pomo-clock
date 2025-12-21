"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, Zap, Mountain, Sparkles, ChevronRight, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PRESET_MILESTONES, Milestone, useMilestoneStore } from "@/store/milestone-store"
import { cn } from "@/lib/utils"

interface MilestoneSelectorProps {
  onSelect: (milestone: Milestone) => void
}

const MILESTONE_ICONS: Record<string, React.ReactNode> = {
  quick: <Zap className="w-6 h-6" />,
  standard: <Target className="w-6 h-6" />,
  marathon: <Mountain className="w-6 h-6" />,
  custom: <Sparkles className="w-6 h-6" />,
}

const MILESTONE_DESCRIPTIONS: Record<string, string> = {
  quick: "Perfect for a quick task",
  standard: "Recommended for focused work",
  marathon: "For ambitious sessions",
  custom: "Set your own goal",
}

export function MilestoneSelector({ onSelect }: MilestoneSelectorProps) {
  const { customTarget, setCustomTarget } = useMilestoneStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCustomInput, setShowCustomInput] = useState(false)

  function handleSelect(milestone: Milestone) {
    if (milestone.id === "custom") {
      setShowCustomInput(true)
      setSelectedId("custom")
      return
    }
    
    setSelectedId(milestone.id)
    setTimeout(() => {
      onSelect(milestone)
    }, 300)
  }

  function handleCustomConfirm() {
    const customMilestone: Milestone = {
      id: "custom",
      label: `${customTarget} Pomodoros`,
      targetPomodoros: customTarget,
      icon: "✨",
    }
    onSelect(customMilestone)
  }

  function adjustCustomTarget(delta: number) {
    const newValue = Math.max(1, Math.min(20, customTarget + delta))
    setCustomTarget(newValue)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Set Your Focus Goal
        </h2>
        <p className="text-muted-foreground">
          Choose a target for this session
        </p>
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {!showCustomInput ? (
            <motion.div
              key="milestone-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-3"
            >
              {PRESET_MILESTONES.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleSelect(milestone)}
                    className={cn(
                      "w-full group relative flex items-center gap-4 p-4 rounded-xl",
                      "bg-card border border-border",
                      "hover:border-primary/50 hover:bg-accent/50",
                      "transition-all duration-200 cursor-pointer",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      selectedId === milestone.id && "border-primary bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-lg",
                        "bg-gradient-to-br",
                        milestone.id === "quick" && "from-amber-500/20 to-orange-500/20 text-amber-500",
                        milestone.id === "standard" && "from-rose-500/20 to-red-500/20 text-rose-500",
                        milestone.id === "marathon" && "from-violet-500/20 to-purple-500/20 text-violet-500",
                        milestone.id === "custom" && "from-emerald-500/20 to-teal-500/20 text-emerald-500"
                      )}
                    >
                      {MILESTONE_ICONS[milestone.id]}
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {milestone.label}
                        </span>
                        {milestone.targetPomodoros > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {milestone.targetPomodoros} {milestone.targetPomodoros === 1 ? "pomodoro" : "pomodoros"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {MILESTONE_DESCRIPTIONS[milestone.id]}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="custom-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500 mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Custom Goal</h3>
                <p className="text-sm text-muted-foreground">
                  How many pomodoros do you want to complete?
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustCustomTarget(-1)}
                  disabled={customTarget <= 1}
                  className="h-12 w-12 rounded-full"
                >
                  <Minus className="w-5 h-5" />
                </Button>

                <div className="w-24 text-center">
                  <span className="text-5xl font-bold text-foreground">
                    {customTarget}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustCustomTarget(1)}
                  disabled={customTarget >= 20}
                  className="h-12 w-12 rounded-full"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground mb-6">
                ≈ {Math.round((customTarget * 25) / 60 * 10) / 10} hours of focus time
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustomInput(false)
                    setSelectedId(null)
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCustomConfirm}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  Start Session
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

