import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/lib/database-types";

type FollowUp = Database["public"]["Tables"]["follow_ups"]["Row"] & {
  clients: { first_name: string; last_name: string } | null;
};

interface FollowUpListProps {
  followUps: FollowUp[];
}

export function FollowUpList({ followUps }: FollowUpListProps) {
  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-semibold">Follow-ups</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {followUps.map((fu) => {
          const isOverdue = new Date(fu.due_at) < new Date();
          return (
            <div key={fu.id} className="flex items-center gap-2 px-4 py-2.5 border-b last:border-0">
              <div className={isOverdue ? "w-2 h-2 rounded-full bg-danger flex-shrink-0" : "w-2 h-2 rounded-full bg-warning flex-shrink-0"} />
              <span className="text-xs">
                {fu.clients?.first_name ?? "Unknown"} {fu.clients?.last_name ?? ""} — {fu.type}
                {isOverdue && " (overdue)"}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}