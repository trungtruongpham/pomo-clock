"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFocusSessions } from "@/app/actions/pomodoro-actions";

interface StatsData {
  totalSessions: number;
  totalDuration: number;
  avgDailyDuration: number;
  avgSessionDuration: number;
}

export default function StatsCards() {
  const searchParams = useSearchParams();
  const range = searchParams.get("range") || "7days";
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalSessions: 0,
    totalDuration: 0,
    avgDailyDuration: 0,
    avgSessionDuration: 0,
  });

  useEffect(() => {
    async function fetchStats() {
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
        const sessions = result.data;
        const totalSessions = sessions.reduce(
          (sum, day) => sum + day.totalSessions,
          0
        );
        const totalDuration = sessions.reduce(
          (sum, day) => sum + day.totalDuration,
          0
        );

        // Calculate days in range (including today)
        const daysDiff =
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;

        setStats({
          totalSessions,
          totalDuration,
          avgDailyDuration: totalDuration / daysDiff,
          avgSessionDuration:
            totalSessions > 0 ? totalDuration / totalSessions : 0,
        });
      }

      setLoading(false);
    }

    fetchStats();
  }, [range]);

  // Format minutes as hours and minutes
  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  return (
    <>
      <StatCard
        title="Total Sessions"
        value={stats.totalSessions.toString()}
        loading={loading}
      />

      <StatCard
        title="Total Focus Time"
        value={formatDuration(stats.totalDuration)}
        loading={loading}
      />

      <StatCard
        title="Avg Daily Focus"
        value={formatDuration(Math.round(stats.avgDailyDuration))}
        loading={loading}
      />
    </>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  loading: boolean;
}

function StatCard({ title, value, loading }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </h3>
      {loading ? (
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold">{value}</p>
      )}
    </div>
  );
}
