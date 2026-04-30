"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, DollarSign, LayoutGrid, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Today", icon: CalendarDays },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/schedule", label: "Schedule", icon: LayoutGrid },
  { href: "/revenue", label: "Revenue", icon: DollarSign },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 z-50">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center gap-0.5 text-xs",
            pathname === item.href
              ? "text-accent font-semibold"
              : "text-muted-foreground"
          )}
        >
          <item.icon size={18} strokeWidth={1.8} />
          <span className="text-[10px]">{item.label}</span>
        </Link>
      ))}
      <Link href="/sessions/new" className="flex flex-col items-center" aria-label="New session">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white -mt-5 shadow-lg">
          <Plus size={20} strokeWidth={2} />
        </div>
      </Link>
    </nav>
  );
}
