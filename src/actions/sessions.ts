"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sessionsOverlap } from "@/lib/utils";

export async function createSessionAction(formData: FormData) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const scheduledStart = new Date(formData.get("scheduled_start") as string);
  const duration = Number(formData.get("duration_minutes") || 60);
  const scheduledEnd = new Date(scheduledStart.getTime() + duration * 60000);

  // Conflict detection: check existing sessions
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
        (new Date(s.scheduled_end).getTime() - new Date(s.scheduled_start).getTime()) / 60000
      )
    );
    if (hasConflict) {
      throw new Error("Time slot conflicts with an existing session");
    }
  }

  // Build skill_scores object
  const skillScores: Record<string, number> = {};
  formData.forEach((value, key) => {
    if (key.startsWith("skill_")) {
      skillScores[key.replace("skill_", "")] = Number(value);
    }
  });

  await supabase.from("sessions").insert({
    org_id: profile.org_id,
    client_id: formData.get("client_id") as string,
    session_type: formData.get("session_type") as string,
    scheduled_start: scheduledStart.toISOString(),
    scheduled_end: scheduledEnd.toISOString(),
    location: (formData.get("location") as string) || null,
    skill_scores: skillScores,
    payment_amount: (formData.get("payment_amount") as string) || null,
    payment_method: (formData.get("payment_method") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  revalidatePath("/schedule");
  revalidatePath("/dashboard");
}
