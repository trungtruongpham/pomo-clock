import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getMinutesLeaders,
  getSessionsLeaders,
  getStreakLeaders,
} from "@/app/actions/pomodoro-actions";

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
    <div className="py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Focus Leaders</h1>
        <p className="mt-2 text-muted-foreground">
          See who&apos;s been the most focused and productive with PomoClock
        </p>
      </div>

      <Card className="w-full dark:bg-black">
        <CardHeader>
          <Tabs defaultValue="minutes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="minutes">Minutes</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="streaks">Streaks</TabsTrigger>
            </TabsList>

            <CardContent className="pt-6">
              <TabsContent value="minutes" className="mt-0">
                <LeaderboardTable
                  data={minutesLeaders}
                  caption="Top users by total focus minutes"
                  valueLabel="Minutes"
                  formatValue={(val) => `${val} mins`}
                  emptyMessage="No focus time data available yet"
                />
              </TabsContent>

              <TabsContent value="sessions" className="mt-0">
                <LeaderboardTable
                  data={sessionsLeaders}
                  caption="Top users by total completed sessions"
                  valueLabel="Sessions"
                  formatValue={(val) => val.toString()}
                  emptyMessage="No sessions data available yet"
                />
              </TabsContent>

              <TabsContent value="streaks" className="mt-0">
                <LeaderboardTable
                  data={streakLeaders}
                  caption="Top users by longest daily focus streaks"
                  valueLabel="Days"
                  formatValue={(val) => `${val} days`}
                  emptyMessage="No streak data available yet"
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}

interface LeaderboardTableProps {
  data: { rank: number; name: string; value: number }[];
  caption: string;
  valueLabel: string;
  formatValue: (value: number) => string;
  emptyMessage: string;
}

function LeaderboardTable({
  data,
  caption,
  valueLabel,
  formatValue,
  emptyMessage,
}: LeaderboardTableProps) {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">{valueLabel}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((leader) => (
          <TableRow key={leader.rank}>
            <TableCell className="font-medium">#{leader.rank}</TableCell>
            <TableCell>{leader.name}</TableCell>
            <TableCell className="text-right">
              {formatValue(leader.value)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
