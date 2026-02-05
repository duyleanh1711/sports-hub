"use client";

import { useRouter, usePathname } from "next/navigation";

import {
  SunIcon,
  MoonIcon,
  LanguageIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ComputerDesktopIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth";
import { logoutAction } from "@/actions/auth";
import { useMe } from "@/react-query/query/user";

import { getInitials } from "@/utils/get-initials";

import {
  Menu,
  MenuItem,
  MenuLabel,
  MenuHeader,
  MenuContent,
  MenuSection,
  MenuSubMenu,
  MenuTrigger,
  MenuSeparator,
} from "@/components/ui/menu";
import { Loader } from "@/components/ui/loader";
import { Avatar } from "@/components/ui/avatar";

export function UserButton() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const t = useTranslations("user.menu");

  const { data, isPending } = useMe();
  const user = data?.data;

  const { resolvedTheme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { resetAuth } = useAuthStore();

  const handleLogout = async () => {
    await logoutAction();
    resetAuth();
    queryClient.clear();
    router.replace("/login");
  };

  const switchLanguage = (nextLocale: "vi" | "en") => {
    const segments = pathname.split("/");
    segments[1] = nextLocale;

    router.replace(segments.join("/"));
  };

  if (isPending) {
    return <Loader variant="ring" className="size-6 text-primary" />;
  }

  if (!user) return null;

  return (
    <Menu>
      <MenuTrigger aria-label="Open user menu">
        <Avatar
          size="md"
          src={user.avatar_url}
          initials={getInitials(user.fullname)}
        />
      </MenuTrigger>

      <MenuContent popover={{ placement: "bottom end" }} className="min-w-64">
        {/* Header */}
        <MenuHeader separator>
          <div className="flex items-center gap-3">
            <Avatar
              size="md"
              src={user.avatar_url}
              initials={getInitials(user.fullname)}
            />
            <div className="flex flex-col leading-tight">
              <span className="block font-medium">{user.fullname}</span>
              <span className="text-xs font-normal text-muted-fg">
                {user.email}
              </span>
            </div>
          </div>
        </MenuHeader>

        {/* Account */}
        <MenuSection>
          <MenuItem onAction={() => router.push("/profile")}>
            <UserCircleIcon />
            <MenuLabel>{t("profile")}</MenuLabel>
          </MenuItem>

          <MenuItem onAction={() => router.push("/settings")}>
            <Cog6ToothIcon />
            <MenuLabel>{t("settings")}</MenuLabel>
          </MenuItem>
        </MenuSection>

        <MenuSeparator />

        {/* Theme */}
        <MenuSubMenu>
          <MenuItem>
            {resolvedTheme === "light" ? (
              <SunIcon />
            ) : resolvedTheme === "dark" ? (
              <MoonIcon />
            ) : (
              <ComputerDesktopIcon />
            )}
            <MenuLabel>{t("theme.label")}</MenuLabel>
          </MenuItem>

          <MenuContent>
            <MenuItem onAction={() => setTheme("system")}>
              <ComputerDesktopIcon />
              <MenuLabel>{t("theme.system")}</MenuLabel>
            </MenuItem>
            <MenuItem onAction={() => setTheme("dark")}>
              <MoonIcon />
              <MenuLabel>{t("theme.dark")}</MenuLabel>
            </MenuItem>
            <MenuItem onAction={() => setTheme("light")}>
              <SunIcon />
              <MenuLabel>{t("theme.light")}</MenuLabel>
            </MenuItem>
          </MenuContent>
        </MenuSubMenu>

        {/* Language */}
        <MenuSubMenu>
          <MenuItem>
            <LanguageIcon />
            <MenuLabel>{t("language.label")}</MenuLabel>
          </MenuItem>

          <MenuContent>
            <MenuItem
              onAction={() => switchLanguage("vi")}
              isDisabled={locale === "vi"}
            >
              <MenuLabel>{t("language.vi")}</MenuLabel>
            </MenuItem>
            <MenuItem
              onAction={() => switchLanguage("en")}
              isDisabled={locale === "en"}
            >
              <MenuLabel>{t("language.en")}</MenuLabel>
            </MenuItem>
          </MenuContent>
        </MenuSubMenu>

        <MenuSeparator />

        {/* Logout */}
        <MenuItem intent="danger" onAction={handleLogout}>
          <ArrowLeftOnRectangleIcon />
          <MenuLabel>{t("logout")}</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
