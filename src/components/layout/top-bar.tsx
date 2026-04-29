import { Search, Bell } from "lucide-react";
import { OrgSwitcher } from "./org-switcher";

export function TopBar() {
  return (
    <header className="h-12 bg-light-surface border-b border-light-border flex items-center px-4 gap-3 dark:bg-dark-surface dark:border-dark-border">
      <OrgSwitcher />
      <div className="flex-1 flex items-center bg-light-muted rounded-md px-3 py-1.5 text-sm text-muted-foreground dark:bg-dark-muted">
        <Search size={14} strokeWidth={1.8} className="mr-2 shrink-0" />
        <span className="truncate">Search anything...</span>
      </div>
      <button className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent rounded" aria-label="Notifications">
        <Bell size={18} strokeWidth={1.8} />
      </button>
    </header>
  );
}
