"use client";

import { useEffect, useState } from "react";

import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent } from "../ui/tooltip";

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
  const t = useTranslations("theme");

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
    <Tooltip delay={0}>
      <Button
        size="sq-sm"
        intent={appearance}
        aria-label={t("label")}
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

      {/* Current theme */}
      <TooltipContent>{t(theme ?? "system")}</TooltipContent>
    </Tooltip>
  );
}
