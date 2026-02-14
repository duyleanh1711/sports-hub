"use client";

import { usePathname } from "next/navigation";

import { cn } from "tailwind-variants";
import { useTranslations } from "next-intl";
import { Bars3Icon } from "@heroicons/react/24/outline";

import { stripLocale } from "@/utils/strip-locale";
import { PROFILE_SIDEBAR_ITEMS } from "@/constants/profile-sidebar-items";

import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu";

export function ProfileSidebar() {
  const pathname = usePathname();
  const t = useTranslations("profile.sidebar");

  const normalizedPath = stripLocale(pathname);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:block w-[30%] h-[calc(100vh-130px)] space-y-3">
        <h2 className="text-lg font-bold text-muted-foreground">
          {t("heading")}
        </h2>

        <div className="space-y-1">
          {PROFILE_SIDEBAR_ITEMS.map(({ key, href, icon: Icon }) => {
            const active = normalizedPath.startsWith(href);

            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-[15px] transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                <span className={active ? "font-medium" : undefined}>
                  {t(key)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="w-full lg:hidden">
        <Menu>
          <Button intent="outline">
            <Bars3Icon />
          </Button>

          <MenuContent
            popover={{ placement: "bottom right" }}
            items={PROFILE_SIDEBAR_ITEMS}
          >
            {(item) => {
              const active = normalizedPath.startsWith(item.href);
              const Icon = item.icon;

              return (
                <MenuItem
                  id={item.key}
                  href={item.href}
                  className={cn(
                    active && "text-primary font-medium bg-primary/10",
                  )}
                >
                  <Icon
                    className={cn("size-4 shrink-0", active && "text-primary")}
                  />
                  {t(item.key)}
                </MenuItem>
              );
            }}
          </MenuContent>
        </Menu>
      </div>
    </>
  );
}
