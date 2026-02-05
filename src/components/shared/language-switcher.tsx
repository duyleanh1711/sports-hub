"use client";

import { usePathname, useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";
import { LanguageIcon } from "@heroicons/react/24/outline";

import { Button } from "../ui/button";
import { Menu, MenuItem, MenuLabel, MenuContent } from "@/components/ui/menu";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");

  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (nextLocale: "vi" | "en") => {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.replace(segments.join("/"));
  };

  return (
    <Menu>
      {/* Menu trigger */}
      <Button size="sq-sm" intent="outline" aria-label="Switch language">
        <LanguageIcon className="size-4" />
      </Button>

      {/* Menu content */}
      <MenuContent>
        <MenuItem
          onAction={() => switchLocale("vi")}
          data-selected={locale === "vi"}
        >
          <MenuLabel>{t("vi")}</MenuLabel>
        </MenuItem>

        <MenuItem
          onAction={() => switchLocale("en")}
          data-selected={locale === "en"}
        >
          <MenuLabel>{t("en")}</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
