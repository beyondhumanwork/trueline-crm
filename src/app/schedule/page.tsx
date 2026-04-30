import { AppShell } from "@/components/layout/app-shell";
import { WeekCalendar } from "@/components/sessions/week-calendar";
import { SessionForm } from "@/components/sessions/session-form";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SchedulePage() {
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .order("scheduled_start", { ascending: true });

  const { data: clients } = await supabase
    .from("clients")
    .select("id, first_name, last_name")
    .eq("status", "active")
    .order("first_name");

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Schedule</h1>

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="new">New Session</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Week View</CardTitle>
              </CardHeader>
              <CardContent>
                <WeekCalendar sessions={sessions ?? []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Schedule a Session</CardTitle>
              </CardHeader>
              <CardContent>
                <SessionForm clients={clients ?? []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
