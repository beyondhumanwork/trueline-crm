import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendReminder } from "@/lib/reminders";

export async function GET(request: Request) {
  // Verify cron auth
  const cronSecret = request.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Calculate 24-hour window
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Fetch scheduled sessions in the next 24 hours
  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("id, client_id, scheduled_start, location")
    .eq("status", "scheduled")
    .gte("scheduled_start", now.toISOString())
    .lte("scheduled_start", tomorrow.toISOString());

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch sessions", details: error.message },
      { status: 500 }
    );
  }

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ remindersSent: 0, message: "No upcoming sessions" });
  }

  let remindersSent = 0;
  const errors: string[] = [];

  for (const session of sessions) {
    // Fetch client email
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("first_name, last_name, email")
      .eq("id", session.client_id)
      .single();

    if (clientError || !client || !client.email) {
      errors.push(`Session ${session.id}: client email not found`);
      continue;
    }

    try {
      await sendReminder(
        client.email,
        `${client.first_name} ${client.last_name}`,
        new Date(session.scheduled_start),
        session.location
      );
      remindersSent++;
    } catch (sendError) {
      errors.push(`Session ${session.id}: failed to send reminder`);
    }
  }

  return NextResponse.json({
    remindersSent,
    totalSessions: sessions.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
