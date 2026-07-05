"use client";

import React from "react";
import { useTheme } from "./Providers";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed bottom-6 left-6 z-50 rounded-full w-12 h-12 glass-panel glass-panel-hover flex items-center justify-center text-primary-foreground border-border hover:bg-accent/20 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400 glow-text" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600" />
      )}
    </Button>
  );
}
