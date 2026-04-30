import { AppShell } from "@/components/layout/app-shell";
import { RevenueBarChart } from "@/components/revenue/revenue-bar-chart";
import { RevenueDonutChart } from "@/components/revenue/revenue-donut-chart";
import { createClient } from "@/lib/supabase/server";

const SESSION_TYPE_LABELS: Record<string, string> = {
  private: "Private",
  cornering_clinic: "Cornering Clinic",
  platinum_ride: "Platinum Ride",
  corporate: "Corporate",
};

function RevenueError({ message }: { message: string }) {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Revenue</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </AppShell>
  );
}

export default async function RevenuePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <RevenueError message="Not authenticated" />;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile || profileError) return <RevenueError message="Profile not found" />;

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("payment_amount, scheduled_start, session_type")
    .eq("status", "completed")
    .eq("org_id", profile.org_id)
    .order("scheduled_start", { ascending: true });

  if (sessionsError) return <RevenueError message="Failed to load revenue data" />;

  const completedSessions = sessions ?? [];

  const monthlyMap = new Map<string, number>();
  const typeMap = new Map<string, number>();

  for (const session of completedSessions) {
    const amount = Number(session.payment_amount ?? 0);
    if (Number.isNaN(amount)) continue;

    const date = new Date(session.scheduled_start);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    monthlyMap.set(yearMonth, (monthlyMap.get(yearMonth) ?? 0) + amount);

    const typeKey = session.session_type ?? "unknown";
    typeMap.set(typeKey, (typeMap.get(typeKey) ?? 0) + amount);
  }

  const sortedMonths = Array.from(monthlyMap.keys()).sort();
  const last12 = sortedMonths.slice(-12);

  const barData = last12.map((month) => ({
    month,
    revenue: monthlyMap.get(month) ?? 0,
  }));

  const donutData = Array.from(typeMap.entries()).map(([name, value]) => ({
    name: SESSION_TYPE_LABELS[name] ?? name,
    value,
  }));

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Revenue</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueBarChart data={barData} />
          <RevenueDonutChart data={donutData} />
        </div>
      </div>
    </AppShell>
  );
}
