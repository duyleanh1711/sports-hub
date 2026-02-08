"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  HomeIcon,
  UserCircleIcon,
  ChevronUpDownIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth";
import { logout } from "@/actions/auth";
import { useMe } from "@/react-query/query/user";

import { stripLocale } from "@/utils/strip-locale";
import { getInitials } from "@/utils/get-initials";

import {
  Menu,
  MenuItem,
  MenuHeader,
  MenuContent,
  MenuSection,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarItem,
  SidebarRail,
  SidebarLabel,
  SidebarFooter,
  SidebarHeader,
  SidebarSection,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Link } from "@/components/ui/link";
import { Avatar } from "@/components/ui/avatar";

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>,
) {
  const router = useRouter();
  const t = useTranslations("admin.sidebar");

  const { data, isPending } = useMe();
  const user = data?.data;

  const queryClient = useQueryClient();
  const { resetAuth } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    resetAuth();
    queryClient.clear();
    router.replace("/login");
    window.location.reload();
  };

  const pathname = usePathname();
  const cleanPath = stripLocale(pathname ?? "/");

  const isDashboard = cleanPath === "/admin/dashboard";
  const isAccount = cleanPath.startsWith("/admin/account");

  if (isPending || !user) return null;

  return (
    <Sidebar {...props}>
      {/* App logo and name */}
      <SidebarHeader>
        <Tooltip delay={0}>
          <TooltipTrigger aria-label={t("home")}>
            <Link href="/" className="flex items-center gap-x-2">
              <Avatar
                isSquare
                size="sm"
                className="outline-hidden"
                src="https://design.intentui.com/logo"
              />
              <SidebarLabel className="font-medium">
                Intent <span className="text-muted-fg">UI</span>
              </SidebarLabel>
            </Link>
          </TooltipTrigger>
          <TooltipContent>{t("home")}</TooltipContent>
        </Tooltip>
      </SidebarHeader>

      {/* Sidebar navigation */}
      <SidebarContent>
        <SidebarSection label={t("overview")}>
          {/* Dashboard page */}
          <SidebarItem isCurrent={isDashboard} href="/admin/dashboard">
            <HomeIcon />
            <SidebarLabel>{t("dashboard")}</SidebarLabel>
          </SidebarItem>

          {/* Account management page */}
          <SidebarItem isCurrent={isAccount} href="/admin/account">
            <UserCircleIcon />
            <SidebarLabel>{t("account")}</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarContent>

      {/* User menu and actions */}
      <SidebarFooter className="flex flex-row justify-between gap-4 group-data-[state=collapsed]:flex-col">
        <Menu>
          {/* User menu trigger */}
          <MenuTrigger
            className="flex w-full items-center justify-between"
            aria-label="Profile"
          >
            <div className="flex items-center gap-x-2">
              {/* User avatar */}
              <Avatar
                className="size-8 *:size-8 group-data-[state=collapsed]:size-6 group-data-[state=collapsed]:*:size-6"
                isSquare
                src={user.avatar_url}
                initials={getInitials(user.fullname)}
              />

              {/* User info, hidden when sidebar is collapsed */}
              <div className="in-data-[collapsible=dock]:hidden text-sm">
                <SidebarLabel>{user.fullname}</SidebarLabel>
                <span className="text-xs -mt-0.5 block text-muted-fg">
                  {user.email}
                </span>
              </div>
            </div>

            <ChevronUpDownIcon data-slot="chevron" />
          </MenuTrigger>

          {/* User menu content */}
          <MenuContent
            className="in-data-[sidebar-collapsible=collapsed]:min-w-56 min-w-(--trigger-width)"
            placement="bottom right"
          >
            <MenuSection>
              {/* User details */}
              <MenuHeader separator>
                <span className="block">{user.fullname}</span>
                <span className="font-normal text-muted-fg">{user.email}</span>
              </MenuHeader>
            </MenuSection>

            {/* Logout action */}
            <MenuItem intent="danger" onAction={handleLogout}>
              <ArrowRightStartOnRectangleIcon />
              {t("userMenu.logout")}
            </MenuItem>
          </MenuContent>
        </Menu>
      </SidebarFooter>

      {/* Collapsed sidebar rail */}
      <SidebarRail />
    </Sidebar>
  );
}
