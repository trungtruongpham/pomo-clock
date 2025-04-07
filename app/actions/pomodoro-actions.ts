"use server";

import { createServerSupabase } from "@/lib/supabase-server";
import { ActionResponse } from "@/types/actions";
import { unstable_cache } from "next/cache";

interface SaveSessionParams {
  duration: number;
  completed_at?: Date;
}

// Server action to save a completed pomodoro session
export async function savePomodorSession({
  duration,
  completed_at = new Date(),
}: SaveSessionParams): Promise<ActionResponse> {
  const supabase = await createServerSupabase();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user is logged in, return early
    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Insert the new record into pomodoro_sessions
    const { error } = await supabase.from("pomodoro_sessions").insert({
      user_id: user.id,
      completed_at,
      duration,
      created_at: new Date(),
    });

    if (error) {
      console.error("Error saving pomodoro session:", error);
      return {
        success: false,
        error: error.message || "Failed to save pomodoro session",
      };
    }

    return {
      success: true,
      data: { message: "Session recorded successfully" },
    };
  } catch (err) {
    console.error("Error in savePomodorSession:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface FocusSessionData {
  date: string;
  totalSessions: number;
  totalDuration: number;
}

export async function getFocusSessions(
  dateRange?: DateRange
): Promise<ActionResponse<FocusSessionData[]>> {
  const supabase = await createServerSupabase();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Set default date range to last 7 days if not provided
    const endDate = dateRange?.endDate || new Date();
    const startDate = dateRange?.startDate || new Date(endDate);
    if (!dateRange) {
      startDate.setDate(startDate.getDate() - 7);
    }

    // Format dates for Supabase query
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    // Query pomodoro sessions within date range
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select("*")
      .eq("user_id", user.id)
      .gte("completed_at", startDateStr)
      .lte("completed_at", endDateStr)
      .order("completed_at", { ascending: true });

    if (error) {
      console.error("Error fetching focus sessions:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch focus sessions",
      };
    }

    // Process data to group by day
    const sessionsByDay: Record<
      string,
      { totalSessions: number; totalDuration: number }
    > = {};

    data.forEach((session) => {
      const date = new Date(session.completed_at).toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!sessionsByDay[date]) {
        sessionsByDay[date] = { totalSessions: 0, totalDuration: 0 };
      }

      sessionsByDay[date].totalSessions += 1;
      sessionsByDay[date].totalDuration += session.duration;
    });

    // Convert to array format
    const result = Object.entries(sessionsByDay).map(([date, stats]) => ({
      date,
      totalSessions: stats.totalSessions,
      totalDuration: Math.round(stats.totalDuration / 60), // Convert seconds to minutes
    }));

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error("Error in getFocusSessions:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

interface LeaderData {
  rank: number;
  name: string;
  value: number;
  user_id: string;
}

// Get top users by total focus minutes
export async function getMinutesLeaders(
  limit = 5
): Promise<ActionResponse<LeaderData[]>> {
  return getMinutesLeadersCached(limit);
}

// Cached version of getMinutesLeaders
const getMinutesLeadersCached = unstable_cache(
  async (limit: number): Promise<ActionResponse<LeaderData[]>> => {
    // Import inside the function to avoid issues with module resolution in server components
    const { createAnonSupabaseClient } = await import("@/lib/supabase-anon");
    const supabase = createAnonSupabaseClient();

    try {
      // First get all sessions to calculate totals
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("pomodoro_sessions")
        .select("user_id, duration")
        .order("completed_at", { ascending: false })
        // Limit to sessions in the last 30 days to make it more current
        .gte(
          "completed_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (sessionsError) {
        console.error("Error fetching minutes leaders:", sessionsError);
        return {
          success: false,
          error: sessionsError.message || "Failed to fetch minutes leaders",
        };
      }

      // Group by user and sum durations
      const userTotals: Record<string, { total: number }> = {};

      sessionsData.forEach((session) => {
        const userId = session.user_id;
        if (!userTotals[userId]) {
          userTotals[userId] = { total: 0 };
        }
        userTotals[userId].total += session.duration;
      });

      // Get top users by total duration
      const topUserIds = Object.entries(userTotals)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, limit)
        .map(([userId]) => userId);

      if (topUserIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Fetch user profile data for the top users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .in("id", topUserIds);

      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
        return {
          success: false,
          error: profilesError.message || "Failed to fetch user profiles",
        };
      }

      // Map profiles to a dictionary for easier lookup
      type ProfileRecord = {
        id: string;
        username: string | null;
        display_name: string | null;
      };

      const profilesMap: Record<string, ProfileRecord> = {};
      profilesData?.forEach((profile) => {
        profilesMap[profile.id] = profile as ProfileRecord;
      });

      // Create the final leaders array
      const leaders = topUserIds.map((user_id, index) => {
        const profile = profilesMap[user_id];
        const totalMinutes = Math.round(userTotals[user_id].total / 60); // Convert seconds to minutes

        return {
          rank: index + 1,
          user_id,
          name: profile?.display_name || profile?.username || "Anonymous User",
          value: totalMinutes,
        };
      });

      return {
        success: true,
        data: leaders,
      };
    } catch (err) {
      console.error("Error in getMinutesLeaders:", err);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },
  ["minutes-leaders"],
  { revalidate: 3600, tags: ["leaderboard", "minutes"] }
);

// Get top users by total completed sessions
export async function getSessionsLeaders(
  limit = 5
): Promise<ActionResponse<LeaderData[]>> {
  return getSessionsLeadersCached(limit);
}

// Cached version of getSessionsLeaders
const getSessionsLeadersCached = unstable_cache(
  async (limit: number): Promise<ActionResponse<LeaderData[]>> => {
    // Import inside the function to avoid issues with module resolution in server components
    const { createAnonSupabaseClient } = await import("@/lib/supabase-anon");
    const supabase = createAnonSupabaseClient();

    try {
      // Count sessions by user
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("pomodoro_sessions")
        .select("user_id")
        .order("completed_at", { ascending: false })
        // Limit to sessions in the last 30 days to make it more current
        .gte(
          "completed_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (sessionsError) {
        console.error("Error fetching sessions leaders:", sessionsError);
        return {
          success: false,
          error: sessionsError.message || "Failed to fetch sessions leaders",
        };
      }

      // Count sessions per user
      const userCounts: Record<string, number> = {};
      sessionsData.forEach((session) => {
        const userId = session.user_id;
        if (!userCounts[userId]) {
          userCounts[userId] = 0;
        }
        userCounts[userId]++;
      });

      // Get top users by session count
      const topUserIds = Object.entries(userCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([userId]) => userId);

      if (topUserIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Fetch user profile data for the top users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .in("id", topUserIds);

      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
        return {
          success: false,
          error: profilesError.message || "Failed to fetch user profiles",
        };
      }

      // Map profiles to a dictionary for easier lookup
      type ProfileRecord = {
        id: string;
        username: string | null;
        display_name: string | null;
      };

      const profilesMap: Record<string, ProfileRecord> = {};
      profilesData?.forEach((profile) => {
        profilesMap[profile.id] = profile as ProfileRecord;
      });

      // Create the final leaders array
      const leaders = topUserIds.map((user_id, index) => {
        const profile = profilesMap[user_id];
        return {
          rank: index + 1,
          user_id,
          name: profile?.display_name || profile?.username || "Anonymous User",
          value: userCounts[user_id],
        };
      });

      return {
        success: true,
        data: leaders,
      };
    } catch (err) {
      console.error("Error in getSessionsLeaders:", err);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },
  ["sessions-leaders"],
  { revalidate: 3600, tags: ["leaderboard", "sessions"] }
);

// Get top users by longest daily streak
export async function getStreakLeaders(
  limit = 5
): Promise<ActionResponse<LeaderData[]>> {
  return getStreakLeadersCached(limit);
}

// Cached version of getStreakLeaders
const getStreakLeadersCached = unstable_cache(
  async (limit: number): Promise<ActionResponse<LeaderData[]>> => {
    // Import inside the function to avoid issues with module resolution in server components
    const { createAnonSupabaseClient } = await import("@/lib/supabase-anon");
    const supabase = createAnonSupabaseClient();

    try {
      // Get all completed sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("pomodoro_sessions")
        .select("user_id, completed_at")
        .order("completed_at", { ascending: true });

      if (sessionsError) {
        console.error("Error fetching streak data:", sessionsError);
        return {
          success: false,
          error: sessionsError.message || "Failed to fetch streak data",
        };
      }

      // Process session data to calculate streaks by user
      const userSessionDays: Record<string, Set<string>> = {};

      sessionsData.forEach((session) => {
        const userId = session.user_id;
        const sessionDate = new Date(session.completed_at)
          .toISOString()
          .split("T")[0]; // YYYY-MM-DD

        if (!userSessionDays[userId]) {
          userSessionDays[userId] = new Set();
        }

        userSessionDays[userId].add(sessionDate);
      });

      // Calculate the longest streak for each user
      const userStreaks: Record<string, number> = {};

      for (const [userId, dates] of Object.entries(userSessionDays)) {
        // Convert to array and sort
        const sortedDates = Array.from(dates).sort();

        let currentStreak = 1;
        let maxStreak = 1;
        let previousDate = new Date(sortedDates[0]);

        for (let i = 1; i < sortedDates.length; i++) {
          const currentDate = new Date(sortedDates[i]);
          const diffDays = Math.floor(
            (currentDate.getTime() - previousDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            // Consecutive days
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else if (diffDays > 1) {
            // Break in streak
            currentStreak = 1;
          }

          previousDate = currentDate;
        }

        userStreaks[userId] = maxStreak;
      }

      // Get top users by streak length
      const topUserIds = Object.entries(userStreaks)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([userId]) => userId);

      if (topUserIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Fetch user profile data for the top users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .in("id", topUserIds);

      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
        return {
          success: false,
          error: profilesError.message || "Failed to fetch user profiles",
        };
      }

      // Map profiles to a dictionary for easier lookup
      type ProfileRecord = {
        id: string;
        username: string | null;
        display_name: string | null;
      };

      const profilesMap: Record<string, ProfileRecord> = {};
      profilesData?.forEach((profile) => {
        profilesMap[profile.id] = profile as ProfileRecord;
      });

      // Create the final leaders array
      const leaders = topUserIds.map((user_id, index) => {
        const profile = profilesMap[user_id];
        return {
          rank: index + 1,
          user_id,
          name: profile?.display_name || profile?.username || "Anonymous User",
          value: userStreaks[user_id],
        };
      });

      return {
        success: true,
        data: leaders,
      };
    } catch (err) {
      console.error("Error in getStreakLeaders:", err);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },
  ["streak-leaders"],
  { revalidate: 3600, tags: ["leaderboard", "streaks"] }
);
