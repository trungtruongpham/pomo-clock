"use server";

import { createServerSupabase } from "@/lib/supabase-server";
import { ActionResponse } from "@/types/actions";

interface TargetSessionData {
  id: string;
  target_id: string;
  target_label: string;
  target_icon: string;
  target_color: string;
  completed_pomodoros: number;
  total_focus_minutes: number;
  session_date: string;
}

interface SaveTargetSessionParams {
  target_id: string;
  target_label: string;
  target_icon: string;
  target_color: string;
  focus_minutes: number;
}

// Get today's target session data for a specific target
export async function getTodayTargetSession(
  targetId: string
): Promise<ActionResponse<TargetSessionData | null>> {
  const supabase = await createServerSupabase();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: true,
        data: null, // Return null for non-authenticated users
      };
    }

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("target_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("target_id", targetId)
      .eq("session_date", today)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching target session:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch target session",
      };
    }

    return {
      success: true,
      data: data
        ? {
            ...data,
            total_focus_minutes: Number(data.total_focus_minutes),
          }
        : null,
    };
  } catch (err) {
    console.error("Error in getTodayTargetSession:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// Save or update a target session (upsert based on user_id, target_id, session_date)
export async function saveTargetSession({
  target_id,
  target_label,
  target_icon,
  target_color,
  focus_minutes,
}: SaveTargetSessionParams): Promise<ActionResponse> {
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

    const today = new Date().toISOString().split("T")[0];

    // First, try to get existing session for today
    const { data: existingSession, error: fetchError } = await supabase
      .from("target_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("target_id", target_id)
      .eq("session_date", today)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing session:", fetchError);
      return {
        success: false,
        error: fetchError.message || "Failed to fetch existing session",
      };
    }

    if (existingSession) {
      // Update existing session
      const { error: updateError } = await supabase
        .from("target_sessions")
        .update({
          completed_pomodoros: existingSession.completed_pomodoros + 1,
          total_focus_minutes:
            Number(existingSession.total_focus_minutes) + focus_minutes,
          target_label,
          target_icon,
          target_color,
        })
        .eq("id", existingSession.id);

      if (updateError) {
        console.error("Error updating target session:", updateError);
        return {
          success: false,
          error: updateError.message || "Failed to update target session",
        };
      }
    } else {
      // Insert new session
      const { error: insertError } = await supabase
        .from("target_sessions")
        .insert({
          user_id: user.id,
          target_id,
          target_label,
          target_icon,
          target_color,
          completed_pomodoros: 1,
          total_focus_minutes: focus_minutes,
          session_date: today,
        });

      if (insertError) {
        console.error("Error inserting target session:", insertError);
        return {
          success: false,
          error: insertError.message || "Failed to insert target session",
        };
      }
    }

    return {
      success: true,
      data: { message: "Target session saved successfully" },
    };
  } catch (err) {
    console.error("Error in saveTargetSession:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// Get all target sessions for a user within a date range
export async function getTargetSessionsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<ActionResponse<TargetSessionData[]>> {
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

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("target_sessions")
      .select("*")
      .eq("user_id", user.id)
      .gte("session_date", startDateStr)
      .lte("session_date", endDateStr)
      .order("session_date", { ascending: false });

    if (error) {
      console.error("Error fetching target sessions:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch target sessions",
      };
    }

    const sessions = (data || []).map((session) => ({
      ...session,
      total_focus_minutes: Number(session.total_focus_minutes),
    }));

    return {
      success: true,
      data: sessions,
    };
  } catch (err) {
    console.error("Error in getTargetSessionsByDateRange:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// Get aggregated stats for a specific target
export async function getTargetStats(targetId: string): Promise<
  ActionResponse<{
    totalSessions: number;
    totalFocusMinutes: number;
    streakDays: number;
  }>
> {
  const supabase = await createServerSupabase();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: true,
        data: {
          totalSessions: 0,
          totalFocusMinutes: 0,
          streakDays: 0,
        },
      };
    }

    const { data, error } = await supabase
      .from("target_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("target_id", targetId)
      .order("session_date", { ascending: false });

    if (error) {
      console.error("Error fetching target stats:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch target stats",
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: {
          totalSessions: 0,
          totalFocusMinutes: 0,
          streakDays: 0,
        },
      };
    }

    // Calculate totals
    const totalSessions = data.reduce(
      (sum, session) => sum + session.completed_pomodoros,
      0
    );
    const totalFocusMinutes = data.reduce(
      (sum, session) => sum + Number(session.total_focus_minutes),
      0
    );

    // Calculate streak
    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedDates = data
      .map((s) => s.session_date)
      .sort()
      .reverse();
    const uniqueDates = [...new Set(sortedDates)];

    for (let i = 0; i < uniqueDates.length; i++) {
      const sessionDate = new Date(uniqueDates[i]);
      sessionDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (sessionDate.getTime() === expectedDate.getTime()) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      success: true,
      data: {
        totalSessions,
        totalFocusMinutes,
        streakDays,
      },
    };
  } catch (err) {
    console.error("Error in getTargetStats:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// ==========================================
// Custom Targets Actions
// ==========================================

interface CustomTargetData {
  id: string;
  target_id: string;
  label: string;
  description: string | null;
  icon: string;
  color: string;
  is_active: boolean;
}

interface SaveCustomTargetParams {
  target_id: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
}

// Get all custom targets for the authenticated user
export async function getCustomTargets(): Promise<
  ActionResponse<CustomTargetData[]>
> {
  const supabase = await createServerSupabase();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: true,
        data: [], // Return empty array for non-authenticated users
      };
    }

    const { data, error } = await supabase
      .from("custom_targets")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching custom targets:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch custom targets",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (err) {
    console.error("Error in getCustomTargets:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// Save a new custom target
export async function saveCustomTarget({
  target_id,
  label,
  description,
  icon,
  color,
}: SaveCustomTargetParams): Promise<ActionResponse<CustomTargetData>> {
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

    const { data, error } = await supabase
      .from("custom_targets")
      .insert({
        user_id: user.id,
        target_id,
        label,
        description: description || null,
        icon,
        color,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving custom target:", error);
      return {
        success: false,
        error: error.message || "Failed to save custom target",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Error in saveCustomTarget:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// Update a custom target
export async function updateCustomTarget(
  id: string,
  updates: Partial<SaveCustomTargetParams>
): Promise<ActionResponse> {
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

    const { error } = await supabase
      .from("custom_targets")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id); // Ensure user owns this target

    if (error) {
      console.error("Error updating custom target:", error);
      return {
        success: false,
        error: error.message || "Failed to update custom target",
      };
    }

    return {
      success: true,
      data: { message: "Custom target updated successfully" },
    };
  } catch (err) {
    console.error("Error in updateCustomTarget:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// Delete (soft delete) a custom target
export async function deleteCustomTarget(
  targetId: string
): Promise<ActionResponse> {
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

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from("custom_targets")
      .update({ is_active: false })
      .eq("target_id", targetId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting custom target:", error);
      return {
        success: false,
        error: error.message || "Failed to delete custom target",
      };
    }

    return {
      success: true,
      data: { message: "Custom target deleted successfully" },
    };
  } catch (err) {
    console.error("Error in deleteCustomTarget:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
