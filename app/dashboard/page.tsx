import { redirect } from "next/navigation";
import { getSession } from "../actions/auth-actions";
import FocusSessionChart from "@/components/dashboard/focus-session-chart";
import DateRangeSelector from "@/components/dashboard/date-range-selector";
import StatsCards from "@/components/dashboard/stats-cards";

export default async function DashboardPage() {
  // Verify user is authenticated
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Your Focus Session Dashboard</h1>

      <div className="mb-6">
        <DateRangeSelector />
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatsCards />
      </div>

      <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Focus Session Trend</h2>
        <div className="h-[400px]">
          <FocusSessionChart />
        </div>
      </div>
    </div>
  );
}
