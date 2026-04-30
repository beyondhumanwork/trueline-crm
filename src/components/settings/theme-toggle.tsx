"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
        {theme === "light"
          ? <Sun size={18} strokeWidth={1.8} />
          : <Moon size={18} strokeWidth={1.8} />}
        <span>{theme === "light" ? "Light" : "Dark"}</span>
      </Button>
    </div>
  );
}
