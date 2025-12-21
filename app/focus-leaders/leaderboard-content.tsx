"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Clock,
  Target,
  Flame,
  Medal,
  Crown,
  Award,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderData {
  rank: number;
  name: string;
  value: number;
  user_id?: string;
}

interface LeaderboardContentProps {
  minutesLeaders: LeaderData[];
  sessionsLeaders: LeaderData[];
  streakLeaders: LeaderData[];
}

type TabType = "minutes" | "sessions" | "streaks";

const TABS = [
  {
    id: "minutes" as TabType,
    label: "Focus Time",
    icon: Clock,
    description: "Total minutes focused",
    formatValue: (val: number) => `${val} mins`,
    color: "from-rose-500 to-red-500",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-500",
  },
  {
    id: "sessions" as TabType,
    label: "Sessions",
    icon: Target,
    description: "Completed pomodoros",
    formatValue: (val: number) => `${val} sessions`,
    color: "from-teal-500 to-emerald-500",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-500",
  },
  {
    id: "streaks" as TabType,
    label: "Streaks",
    icon: Flame,
    description: "Consecutive days",
    formatValue: (val: number) => `${val} days`,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-500",
  },
];

const RANK_ICONS = [Crown, Medal, Award];
const RANK_COLORS = [
  "from-amber-400 to-yellow-500",
  "from-slate-300 to-slate-400",
  "from-amber-600 to-amber-700",
];

export function LeaderboardContent({
  minutesLeaders,
  sessionsLeaders,
  streakLeaders,
}: LeaderboardContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("minutes");

  const getLeaders = () => {
    switch (activeTab) {
      case "minutes":
        return minutesLeaders;
      case "sessions":
        return sessionsLeaders;
      case "streaks":
        return streakLeaders;
    }
  };

  const activeTabConfig = TABS.find((tab) => tab.id === activeTab)!;
  const leaders = getLeaders();

  return (
    <div className="py-8 sm:py-12 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 shadow-lg shadow-rose-500/25 mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Focus Leaders
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          See who&apos;s been the most focused and productive with PomoClock
          this month
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <div className="inline-flex bg-muted/50 rounded-xl p-1.5 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                  "transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const data =
            tab.id === "minutes"
              ? minutesLeaders
              : tab.id === "sessions"
                ? sessionsLeaders
                : streakLeaders;
          const totalValue = data.reduce((sum, leader) => sum + leader.value, 0);
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left",
                isActive
                  ? "border-primary/50 bg-card shadow-lg"
                  : "border-border/50 bg-card/50 hover:bg-card hover:border-border"
              )}
            >
              <div
                className={cn(
                  "inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3",
                  tab.bgColor
                )}
              >
                <Icon className={cn("w-5 h-5", tab.textColor)} />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {tab.id === "minutes"
                  ? `${Math.round(totalValue / 60)}h`
                  : totalValue}
              </div>
              <div className="text-xs text-muted-foreground">{tab.label}</div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className={cn(
                    "absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r",
                    tab.color
                  )}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Leaderboard List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-xl"
        >
          {/* List Header */}
          <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Top {leaders.length} Leaders
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {activeTabConfig.description}
              </span>
            </div>
          </div>

          {/* Leaders */}
          {leaders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                <Trophy className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No data available yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Be the first to start focusing!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {leaders.map((leader, index) => (
                <LeaderRow
                  key={leader.rank}
                  leader={leader}
                  index={index}
                  tabConfig={activeTabConfig}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8 text-sm text-muted-foreground"
      >
        <p>Rankings are based on the last 30 days of activity</p>
        <p className="text-xs mt-1">Updated hourly</p>
      </motion.div>
    </div>
  );
}

interface LeaderRowProps {
  leader: LeaderData;
  index: number;
  tabConfig: (typeof TABS)[0];
}

function LeaderRow({ leader, index, tabConfig }: LeaderRowProps) {
  const isTopThree = index < 3;
  const RankIcon = isTopThree ? RANK_ICONS[index] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex items-center gap-4 px-6 py-4",
        "hover:bg-muted/30 transition-colors duration-200",
        index === 0 && "bg-gradient-to-r from-amber-500/5 to-transparent"
      )}
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-12">
        {isTopThree && RankIcon ? (
          <div
            className={cn(
              "inline-flex items-center justify-center w-10 h-10 rounded-full",
              "bg-gradient-to-br shadow-lg",
              RANK_COLORS[index],
              index === 0 && "shadow-amber-500/25"
            )}
          >
            <RankIcon className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/50">
            <span className="text-sm font-bold text-muted-foreground">
              {leader.rank}
            </span>
          </div>
        )}
      </div>

      {/* Avatar & Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
              "font-bold text-white",
              `bg-gradient-to-br ${tabConfig.color}`
            )}
          >
            {leader.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">
              {leader.name}
            </p>
            {index === 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                <Crown className="w-3 h-3" />
                Top Leader
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="flex-shrink-0 text-right">
        <div
          className={cn(
            "text-lg font-bold",
            isTopThree ? tabConfig.textColor : "text-foreground"
          )}
        >
          {leader.value}
        </div>
        <div className="text-xs text-muted-foreground">
          {tabConfig.id === "minutes"
            ? "mins"
            : tabConfig.id === "sessions"
              ? "sessions"
              : "days"}
        </div>
      </div>
    </motion.div>
  );
}

