import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ title, value, trend, trendUp, className }: StatCardProps) {
  return (
    <Card className={cn("border", className)}>
      <CardContent className="pt-4">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        {trend && (
          <div className={cn("text-xs mt-1", trendUp ? "text-success" : "text-muted-foreground")}>
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}