"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Clock,
  Target,
  Flame,
  TrendingUp,
  Calendar,
  ChartLine,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getFocusSessions } from "@/app/actions/pomodoro-actions"
import { PRESET_TARGETS } from "@/store/target-store"
import { FocusChart } from "./focus-chart"

type DateRange = "7days" | "30days" | "month" | "year"

interface StatsData {
  totalSessions: number
  totalDuration: number
  avgDailyDuration: number
  currentStreak: number
  bestDay: string
  bestDayDuration: number
}

interface DailyData {
  date: string
  totalSessions: number
  totalDuration: number
}

const RANGE_OPTIONS = [
  { label: "7 Days", value: "7days" as DateRange },
  { label: "30 Days", value: "30days" as DateRange },
  { label: "This Month", value: "month" as DateRange },
  { label: "This Year", value: "year" as DateRange },
]

export function DashboardContent() {
  const [range, setRange] = useState<DateRange>("7days")
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DailyData[]>([])
  const [stats, setStats] = useState<StatsData>({
    totalSessions: 0,
    totalDuration: 0,
    avgDailyDuration: 0,
    currentStreak: 0,
    bestDay: "",
    bestDayDuration: 0,
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Calculate date range
      const endDate = new Date()
      let startDate = new Date()

      if (range === "7days") {
        startDate.setDate(endDate.getDate() - 7)
      } else if (range === "30days") {
        startDate.setDate(endDate.getDate() - 30)
      } else if (range === "month") {
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
      } else if (range === "year") {
        startDate = new Date(endDate.getFullYear(), 0, 1)
      }

      const result = await getFocusSessions({ startDate, endDate })

      if (result.success && result.data) {
        const sessions = result.data

        // Calculate stats
        const totalSessions = sessions.reduce((sum, day) => sum + day.totalSessions, 0)
        const totalDuration = sessions.reduce((sum, day) => sum + day.totalDuration, 0)
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

        // Find best day
        let bestDay = ""
        let bestDayDuration = 0
        sessions.forEach((day) => {
          if (day.totalDuration > bestDayDuration) {
            bestDayDuration = day.totalDuration
            bestDay = day.date
          }
        })

        setData(sessions)
        setStats({
          totalSessions,
          totalDuration,
          avgDailyDuration: totalDuration / daysDiff,
          currentStreak: calculateStreak(sessions),
          bestDay: bestDay ? formatDateShort(bestDay) : "N/A",
          bestDayDuration,
        })
      } else {
        setData([])
        setStats({
          totalSessions: 0,
          totalDuration: 0,
          avgDailyDuration: 0,
          currentStreak: 0,
          bestDay: "N/A",
          bestDayDuration: 0,
        })
      }

      setLoading(false)
    }

    fetchData()
  }, [range, selectedTarget])

  function calculateStreak(sessions: DailyData[]): number {
    if (sessions.length === 0) return 0
    
    const today = new Date().toISOString().split("T")[0]
    const sessionDates = new Set(sessions.map((s) => s.date))
    
    let streak = 0
    const currentDate = new Date()
    
    // Check if today has sessions, if not start from yesterday
    if (!sessionDates.has(today)) {
      currentDate.setDate(currentDate.getDate() - 1)
    }
    
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0]
      if (sessionDates.has(dateStr)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  function formatDateShort(dateStr: string): string {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const statCards = [
    {
      label: "Total Focus Time",
      value: formatDuration(stats.totalDuration),
      icon: Clock,
      color: "from-rose-500 to-red-500",
      bgColor: "bg-rose-500/10",
    },
    {
      label: "Sessions Completed",
      value: stats.totalSessions.toString(),
      icon: Target,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: Flame,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Daily Average",
      value: formatDuration(Math.round(stats.avgDailyDuration)),
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-500/10",
    },
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500">
              <ChartLine className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Focus Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track your productivity and focus trends
          </p>
        </motion.div>

        {/* Date Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Period:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setRange(option.value)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer",
                  range === option.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border hover:bg-accent/50 text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className={cn(
                "relative overflow-hidden rounded-xl p-4 sm:p-6",
                "bg-card border border-border",
                "transition-all duration-200 hover:shadow-lg"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    card.bgColor
                  )}
                >
                  <card.icon className={cn("w-5 h-5 bg-gradient-to-br bg-clip-text", card.color)} style={{ color: `rgb(var(--${card.color.split('-')[1]}-500))` }} />
                </div>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  {card.label}
                </p>
                {loading ? (
                  <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                )}
              </div>

              {/* Decorative gradient */}
              <div
                className={cn(
                  "absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 blur-2xl",
                  `bg-gradient-to-br ${card.color}`
                )}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Target Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Filter by Target:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTarget(null)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer",
                selectedTarget === null
                  ? "bg-foreground text-background"
                  : "bg-card border border-border hover:bg-accent/50 text-foreground"
              )}
            >
              All Targets
            </button>
            {PRESET_TARGETS.map((target) => (
              <button
                key={target.id}
                onClick={() => setSelectedTarget(target.id)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer",
                  selectedTarget === target.id
                    ? `bg-gradient-to-r ${target.color} text-white`
                    : "bg-card border border-border hover:bg-accent/50 text-foreground"
                )}
              >
                {target.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Focus Session Trends
              </h2>
              <p className="text-sm text-muted-foreground">
                Your productivity over time
              </p>
            </div>
          </div>

          <FocusChart data={data} loading={loading} />
        </motion.div>

        {/* Best Day Card */}
        {stats.bestDay !== "N/A" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20">
                <Flame className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Day</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.bestDay} - {formatDuration(stats.bestDayDuration)} of focus
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

