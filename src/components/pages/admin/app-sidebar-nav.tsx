"use client";

import { usePathname } from "next/navigation";

import { useTranslations } from "next-intl";

import { stripLocale } from "@/utils/strip-locale";

import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

import { SidebarNav, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/ui/breadcrumbs";

export default function AppSidebarNav() {
  const pathname = usePathname();
  const t = useTranslations("admin.breadcrumbs");

  const cleanPath = stripLocale(pathname ?? "/");
  const segments = cleanPath.split("/").filter(Boolean);

  return (
    <SidebarNav className="justify-between!">
      <span className="flex items-center gap-x-4">
        <SidebarTrigger className="-ml-2.5 lg:ml-0" />

        <Breadcrumbs className="hidden md:flex">
          {segments.map((segment, index) => {
            // biome-ignore lint/style/useTemplate: <explanation>
            const href = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;

            return (
              <BreadcrumbsItem key={href} href={isLast ? undefined : href}>
                {t.has(segment)
                  ? t(segment)
                  : segment.charAt(0).toUpperCase() + segment.slice(1)}
              </BreadcrumbsItem>
            );
          })}
        </Breadcrumbs>
      </span>

      <div className="flex items-center gap-2">
        <ThemeSwitcher appearance="outline" shape="square" />
        <LanguageSwitcher />
      </div>
    </SidebarNav>
  );
}
