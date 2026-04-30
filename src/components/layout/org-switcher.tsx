"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

export function OrgSwitcher() {
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrg() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", user.id)
        .single();

      if (!profile) return;

      const { data: org } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", profile.org_id)
        .single();

      setOrgName(org?.name ?? "My Organization");
    }
    loadOrg();
  }, []);

  if (orgName === null) return null;

  return (
    <Badge variant="secondary" className="text-xs font-medium cursor-pointer">
      {orgName}
    </Badge>
  );
}
