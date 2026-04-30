"use client";

import { useState } from "react";
import { formatTime, sessionStatusBadge, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Database } from "@/lib/database-types";

type SessionRow = Database["public"]["Tables"]["sessions"]["Row"];

interface WeekCalendarProps {
  sessions: SessionRow[];
}

export function WeekCalendar({ sessions }: WeekCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const weekLabel = `${days[0].toLocaleDateString("en-CA", { month: "short", day: "numeric" })} — ${days[6].toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() - 7);
            setWeekStart(d);
          }}
          className="p-1 hover:bg-accent rounded"
        >
          <ChevronLeft size={18} strokeWidth={1.8} />
        </button>
        <span className="text-sm font-semibold">{weekLabel}</span>
        <button
          type="button"
          onClick={() => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + 7);
            setWeekStart(d);
          }}
          className="p-1 hover:bg-accent rounded"
        >
          <ChevronRight size={18} strokeWidth={1.8} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, i) => {
          const daySessions = sessions.filter((s) => {
            const d = new Date(s.scheduled_start);
            return d.toDateString() === day.toDateString();
          });
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={i}
              className={cn(
                "rounded p-1 text-center text-xs border min-h-[60px]",
                isToday && "border-accent bg-accent/5"
              )}
            >
              <div className="font-medium text-muted-foreground mb-1">
                {day.toLocaleDateString("en-CA", { weekday: "short" })}
              </div>
              <div className="font-bold">{day.getDate()}</div>
              <div className="mt-1 space-y-0.5">
                {daySessions.map((s) => {
                  const badge = sessionStatusBadge(s.status);
                  return (
                    <div
                      key={s.id}
                      className={cn("text-xs truncate px-0.5 py-0.5 rounded", badge.color)}
                    >
                      {formatTime(s.scheduled_start)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
