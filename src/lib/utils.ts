import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format amount as currency string */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format date for display */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/** Format time for display */
export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

/** Check if two time slots overlap (duration in minutes) */
export function sessionsOverlap(
  start1: Date,
  duration1: number,
  start2: Date,
  duration2: number
): boolean {
  const end1 = new Date(start1.getTime() + duration1 * 60000);
  const end2 = new Date(start2.getTime() + duration2 * 60000);
  return start1 < end2 && start2 < end1;
}

/** Get session status label and color class */
export function sessionStatusBadge(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    scheduled: { label: "Scheduled", color: "text-muted-foreground" },
    in_progress: { label: "In Progress", color: "text-warning" },
    completed: { label: "Completed", color: "text-success" },
    cancelled: { label: "Cancelled", color: "text-muted-foreground" },
    no_show: { label: "No Show", color: "text-danger" },
  };
  return map[status] ?? { label: status, color: "text-muted-foreground" };
}
