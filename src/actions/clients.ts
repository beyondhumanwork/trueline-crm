"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.user.id)
    .single();

  await supabase.from("clients").insert({
    org_id: profile!.org_id,
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email") || null,
    phone: formData.get("phone"),
    experience_level: formData.get("experience_level") || "beginner",
    license_type: formData.get("license_type") || null,
    notes: formData.get("notes") || null,
  });

  revalidatePath("/clients");
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient();

  await supabase.from("clients").update({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email") || null,
    phone: formData.get("phone"),
    experience_level: formData.get("experience_level"),
    license_type: formData.get("license_type") || null,
    notes: formData.get("notes") || null,
    status: formData.get("status") || "active",
  }).eq("id", id);

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
}
