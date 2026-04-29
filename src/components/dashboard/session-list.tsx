import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sessionStatusBadge, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/database-types";

type Session = Database["public"]["Tables"]["sessions"]["Row"] & {
  clients: { first_name: string; last_name: string } | null;
};

interface SessionListProps {
  sessions: Session[];
}

export function SessionList({ sessions }: SessionListProps) {
  return (
    <Card>
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Today's Sessions</CardTitle>
        <span className="text-xs text-muted-foreground">{sessions.length} sessions</span>
      </CardHeader>
      <CardContent className="p-0">
        {sessions.map((session) => {
          const badge = sessionStatusBadge(session.status);
          return (
            <div
              key={session.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50 transition-colors",
                session.status === "in_progress" && "bg-warning/5"
              )}
            >
              <div className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                session.status === "completed" && "bg-success",
                session.status === "in_progress" && "bg-warning",
                session.status === "scheduled" && "bg-muted",
                session.status === "cancelled" && "bg-muted-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  {session.clients?.first_name ?? "Unknown"} {session.clients?.last_name ?? ""}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(session.scheduled_start)}{session.location ? ` · ${session.location}` : ""}
                </div>
              </div>
              <span className={cn("text-xs font-medium", badge.color)}>{badge.label}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}