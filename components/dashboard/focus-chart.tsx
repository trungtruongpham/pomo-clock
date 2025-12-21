"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Clock, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChartData {
  date: string
  totalSessions: number
  totalDuration: number
}

interface FocusChartProps {
  data: ChartData[]
  loading: boolean
}

type ChartType = "duration" | "sessions"

export function FocusChart({ data, loading }: FocusChartProps) {
  const [chartType, setChartType] = useState<ChartType>("duration")

  // Format date for display
  const formattedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }))

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="w-full h-full bg-muted/50 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-[350px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">No data available</p>
        <p className="text-sm text-muted-foreground/70">
          Complete some pomodoro sessions to see your trends
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Chart Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setChartType("duration")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer",
            chartType === "duration"
              ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <Clock className="w-4 h-4" />
          Focus Time
        </button>
        <button
          onClick={() => setChartType("sessions")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer",
            chartType === "sessions"
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <Target className="w-4 h-4" />
          Sessions
        </button>
      </div>

      {/* Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "duration" ? (
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(244, 63, 94)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(244, 63, 94)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                dx={-10}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                formatter={(value: number) => [`${value} mins`, "Focus Time"]}
              />
              <Area
                type="monotone"
                dataKey="totalDuration"
                stroke="rgb(244, 63, 94)"
                strokeWidth={3}
                fill="url(#durationGradient)"
                dot={{ fill: "rgb(244, 63, 94)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "rgb(244, 63, 94)", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(16, 185, 129)" />
                  <stop offset="100%" stopColor="rgb(20, 184, 166)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                dx={-10}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                formatter={(value: number) => [`${value} sessions`, "Completed"]}
              />
              <Bar
                dataKey="totalSessions"
                fill="url(#sessionGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

