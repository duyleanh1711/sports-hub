"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth";
import { stripLocale } from "@/utils/strip-locale";

import AppSidebar from "@/components/pages/admin/app-sidebar";
import AppSidebarNav from "@/components/pages/admin/app-sidebar-nav";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { FullScreenLoader } from "@/components/shared/full-screen-loader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isPending } = useAuthStore();

  const cleanPath = stripLocale(pathname ?? "/");
  const isAdminRoute = cleanPath.startsWith("/admin");

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!user.is_superuser && isAdminRoute) {
      router.replace("/");
    }
  }, [user, isPending, isAdminRoute, router]);

  const shouldBlock =
    isPending || !user || (isAdminRoute && !user.is_superuser);

  if (shouldBlock) {
    return <FullScreenLoader variant="ring" className="size-9 text-primary" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar collapsible="dock" />
      <SidebarInset>
        <AppSidebarNav />
        <div className="px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
