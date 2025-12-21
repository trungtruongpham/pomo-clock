import { redirect } from "next/navigation";
import { getSession } from "../actions/auth-actions";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata = {
  title: "Dashboard - PomoClock",
  description: "Track your focus sessions and productivity trends",
};

export default async function DashboardPage() {
  // Verify user is authenticated
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <DashboardContent />;
}
