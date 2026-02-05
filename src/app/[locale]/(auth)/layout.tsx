"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth";

import { FullScreenLoader } from "@/components/shared/full-screen-loader";

const VERIFY_ROUTES = ["/verify/email", "/verify/phone"];

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isVerifying, isPending } = useAuthStore();

  useEffect(() => {
    if (isPending) return;

    const isVerifyRoute = VERIFY_ROUTES.some((r) => pathname.endsWith(r));
    if (isVerifyRoute && !isVerifying) {
      router.replace("/");
      return;
    }

    const isAuthPage = AUTH_ROUTES.some((r) => pathname.endsWith(r));
    if (user && isAuthPage) {
      router.replace(user.is_superuser ? "/admin/dashboard" : "/");
    }
  }, [user, isVerifying, isPending, pathname, router]);

  const isVerifyRoute = VERIFY_ROUTES.some((r) => pathname.endsWith(r));

  const shouldBlock =
    isPending ||
    (isVerifyRoute && !isVerifying) ||
    (user && AUTH_ROUTES.some((r) => pathname.endsWith(r)));

  if (shouldBlock) {
    return <FullScreenLoader variant="ring" className="size-9 text-primary" />;
  }

  return <>{children}</>;
}
