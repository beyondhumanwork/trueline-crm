import { AppShell } from "@/components/layout/app-shell";

export default function DashboardPage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Loading your sessions...</p>
      </div>
    </AppShell>
  );
}
