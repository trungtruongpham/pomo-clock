import {
  getMinutesLeaders,
  getSessionsLeaders,
  getStreakLeaders,
} from "@/app/actions/pomodoro-actions";
import { LeaderboardContent } from "./leaderboard-content";

// Set revalidation time to 1 hour
export const revalidate = 3600;

export const metadata = {
  title: "Focus Leaders - PomoClock",
  description: "See who's been focusing the most with PomoClock",
};

export default async function FocusLeadersPage() {
  // Fetch all leaderboard data in parallel
  const [minutesResponse, sessionsResponse, streakResponse] = await Promise.all(
    [getMinutesLeaders(10), getSessionsLeaders(10), getStreakLeaders(10)]
  );

  // Use data if successful, or empty array as fallback
  const minutesLeaders = minutesResponse.success
    ? minutesResponse.data || []
    : [];
  const sessionsLeaders = sessionsResponse.success
    ? sessionsResponse.data || []
    : [];
  const streakLeaders = streakResponse.success ? streakResponse.data || [] : [];

  return (
    <LeaderboardContent
      minutesLeaders={minutesLeaders}
      sessionsLeaders={sessionsLeaders}
      streakLeaders={streakLeaders}
    />
  );
}
