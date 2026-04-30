"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, DollarSign, LayoutGrid, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Today", icon: CalendarDays },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/schedule", label: "Schedule", icon: LayoutGrid },
  { href: "/revenue", label: "Revenue", icon: DollarSign },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-14 bg-sidebar border-r border-sidebar-border items-center py-4 gap-1">
      <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm mb-3">
        T
      </div>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <item.icon size={18} strokeWidth={1.8} />
        </Link>
      ))}
    </aside>
  );
}
