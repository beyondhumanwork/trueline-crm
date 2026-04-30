"use client";

import { Search, Bell } from "lucide-react";
import { OrgSwitcher } from "./org-switcher";

export function TopBar() {
  return (
    <header className="h-12 bg-card border-b border-border flex items-center px-4 gap-3">
      <OrgSwitcher />
      <div className="flex-1 flex items-center bg-muted rounded-md px-3 py-1.5 text-sm text-muted-foreground">
        <Search size={14} strokeWidth={1.8} className="mr-2 shrink-0" />
        <span className="truncate">Search utilities...</span>
      </div>
      <button className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded" aria-label="Notifications">
        <Bell size={18} strokeWidth={1.8} />
      </button>
    </header>
  );
}
