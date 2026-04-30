"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleSignOut}>
      <LogOut size={18} strokeWidth={1.8} />
      <span>Sign Out</span>
    </Button>
  );
}
