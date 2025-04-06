"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getFocusSessions } from "@/app/actions/pomodoro-actions";

interface FocusSessionData {
  date: string;
  totalSessions: number;
  totalDuration: number;
}

export default function FocusSessionChart() {
  const searchParams = useSearchParams();
  const range = searchParams.get("range") || "7days";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FocusSessionData[]>([]);
  const [chartType, setChartType] = useState<"duration" | "sessions">(
    "duration"
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Calculate date range based on selected option
      const endDate = new Date();
      let startDate = new Date();

      if (range === "7days") {
        startDate.setDate(endDate.getDate() - 7);
      } else if (range === "30days") {
        startDate.setDate(endDate.getDate() - 30);
      } else if (range === "month") {
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      } else if (range === "year") {
        startDate = new Date(endDate.getFullYear(), 0, 1);
      }

      const result = await getFocusSessions({ startDate, endDate });

      if (result.success && result.data) {
        // Format dates for display
        const formattedData = result.data.map((item) => ({
          ...item,
          date: formatDate(item.date),
        }));

        setData(formattedData);
      } else {
        setData([]);
      }

      setLoading(false);
    }

    fetchData();
  }, [range]);

  // Format date for chart display
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full h-[300px] bg-gray-100 dark:bg-black animate-pulse rounded-lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">
          No data available for the selected time range
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("duration")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === "duration"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            }`}
          >
            Focus Time
          </button>
          <button
            onClick={() => setChartType("sessions")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === "sessions"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            }`}
          >
            Sessions
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "duration" ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number) => [`${value} mins`, "Focus Time"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalDuration"
                name="Focus Time"
                stroke="var(--pomodoro)"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{ value: "Count", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number) => [`${value} sessions`, "Sessions"]}
              />
              <Legend />
              <Bar
                dataKey="totalSessions"
                name="Pomodoro Sessions"
                fill="var(--pomodoro)"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
