"use client";

import { usePathname, useRouter } from "next/navigation";

import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (nextLocale: "vi" | "en") => {
    const segments = pathname.split("/");
    segments[1] = nextLocale;

    router.replace(segments.join("/"));
  };

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        intent={locale === "vi" ? "primary" : "outline"}
        onPress={() => switchLocale("vi")}
      >
        VI
      </Button>

      <Button
        size="sm"
        intent={locale === "en" ? "primary" : "outline"}
        onPress={() => switchLocale("en")}
      >
        EN
      </Button>
    </div>
  );
}
