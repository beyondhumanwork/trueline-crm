import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { SessionList } from "@/components/dashboard/session-list";
import { FollowUpList } from "@/components/dashboard/follow-up-list";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: todaySessions } = await supabase
    .from("sessions")
    .select("*, clients(first_name, last_name)")
    .gte("scheduled_start", today.toISOString())
    .lt("scheduled_start", tomorrow.toISOString())
    .order("scheduled_start", { ascending: true });

  const { data: followUps } = await supabase
    .from("follow_ups")
    .select("*, clients(first_name, last_name)")
    .is("completed_at", null)
    .limit(10);

  const completedSessions = todaySessions?.filter((s) => s.status === "completed") ?? [];
  const totalRevenue = completedSessions.reduce((sum, s) => sum + Number(s.payment_amount ?? 0), 0);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{greeting()}, Coach</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {today.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}
              {" · "}{todaySessions?.length ?? 0} sessions today
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Revenue" value={formatCurrency(totalRevenue)} trend="+18% vs last month" trendUp />
          <StatCard title="Sessions" value={`${completedSessions.length}/${todaySessions?.length ?? 0}`} trend="Today" />
          <StatCard title="Active Clients" value="14" trend="+2 this month" trendUp />
          <StatCard title="Follow-ups" value={String(followUps?.length ?? 0)} trend="2 overdue" />
        </div>

        {/* Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SessionList sessions={todaySessions ?? []} />
          </div>
          <div className="space-y-4">
            <FollowUpList followUps={followUps ?? []} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
