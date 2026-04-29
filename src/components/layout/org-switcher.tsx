"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

export function OrgSwitcher() {
  const [orgName, setOrgName] = useState<string>("");

  useEffect(() => {
    async function loadOrg() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("org_id")
          .eq("id", user.id)
          .single();
        if (data) {
          const { data: org } = await supabase
            .from("organizations")
            .select("name")
            .eq("id", data.org_id)
            .single();
          setOrgName(org?.name ?? "");
        }
      }
    }
    loadOrg();
  }, []);

  return (
    <Badge variant="secondary" className="text-xs font-medium cursor-pointer">
      {orgName || "Loading..."}
    </Badge>
  );
}
