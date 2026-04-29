import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Clients</h1>
          <Button asChild size="sm">
            <Link href="/clients/new">+ Add Client</Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-semibold">
              {clients?.length ?? 0} clients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {clients?.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <div className="flex items-center gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent text-xs font-bold">
                    {client.first_name[0]}{client.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">
                      {client.first_name} {client.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">{client.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium">{formatCurrency(Number(client.total_paid))}</div>
                    <Badge variant={client.status === "active" ? "default" : "secondary"} className="text-xs">
                      {client.status}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
