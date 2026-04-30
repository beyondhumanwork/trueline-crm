"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sessionsOverlap } from "@/lib/utils";

const MS_PER_MINUTE = 60000;

interface SessionInput {
  client_id: string;
  session_type: string;
  scheduled_start: string;
  duration_minutes: number;
  location?: string;
  notes?: string;
}

export async function createSessionAction(input: SessionInput) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const scheduledStart = new Date(input.scheduled_start);
  const duration = input.duration_minutes || 60;
  const scheduledEnd = new Date(scheduledStart.getTime() + duration * MS_PER_MINUTE);

  const { data: existing } = await supabase
    .from("sessions")
    .select("scheduled_start, scheduled_end")
    .eq("org_id", profile.org_id)
    .eq("status", "scheduled");

  if (existing) {
    const hasConflict = existing.some((s) =>
      sessionsOverlap(
        scheduledStart,
        duration,
        new Date(s.scheduled_start),
        (new Date(s.scheduled_end).getTime() - new Date(s.scheduled_start).getTime()) / MS_PER_MINUTE
      )
    );
    if (hasConflict) {
      throw new Error("Time slot conflicts with an existing session");
    }
  }

  await supabase.from("sessions").insert({
    org_id: profile.org_id,
    client_id: input.client_id,
    session_type: input.session_type,
    scheduled_start: scheduledStart.toISOString(),
    scheduled_end: scheduledEnd.toISOString(),
    status: "scheduled",
    location: input.location || null,
    notes: input.notes || null,
  });

  revalidatePath("/schedule");
  revalidatePath("/dashboard");
}
