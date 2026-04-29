import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("client_id", id)
    .order("scheduled_start", { ascending: false })
    .limit(10);

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{client.first_name} {client.last_name}</h1>
            <p className="text-sm text-muted-foreground">
              {client.email ?? "No email"} · {client.phone}
            </p>
          </div>
          <Link href={`/clients/${id}/edit`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Edit
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground uppercase">Sessions</div>
              <div className="text-2xl font-bold mt-1">{client.total_sessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground uppercase">Total Paid</div>
              <div className="text-2xl font-bold mt-1">{formatCurrency(Number(client.total_paid))}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground uppercase">Level</div>
              <div className="text-2xl font-bold mt-1 capitalize">{client.experience_level}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground uppercase">License</div>
              <div className="text-lg font-bold mt-2">{client.license_type ?? "—"}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-semibold">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {sessions?.map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0">
                <span className="text-xs text-muted-foreground w-24">{formatDate(s.scheduled_start)}</span>
                <span className="text-xs font-medium">{s.session_type}</span>
                <Badge variant="secondary" className="text-xs ml-auto">{s.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
