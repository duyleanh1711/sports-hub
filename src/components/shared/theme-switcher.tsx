"use client";

import { useEffect, useState } from "react";

import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

type ThemeSwitcherProps = Omit<
  React.ComponentProps<typeof Button>,
  "intent" | "isCircle"
> & {
  shape?: "square" | "circle";
  appearance?: "outline" | "plain";
};

export function ThemeSwitcher({
  shape = "square",
  appearance = "outline",
  ...props
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
  };

  return (
    <Button
      size="sq-sm"
      intent="outline"
      aria-label="Switch theme"
      onPress={toggleTheme}
      {...props}
    >
      {theme === "light" ? (
        <SunIcon />
      ) : theme === "dark" ? (
        <MoonIcon />
      ) : (
        <ComputerDesktopIcon />
      )}
    </Button>
  );
}
