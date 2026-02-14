"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { useTranslations } from "next-intl";

import { useMe } from "@/react-query/query/user";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

import { Container } from "@/components/shared/container";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/ui/breadcrumbs";
import { ProfileSidebar } from "@/components/pages/profile/profile-sidebar";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const t = useTranslations("profile.breadcrumbs");
  const breadcrumbs = useBreadcrumbs(t);

  const { data, isLoading, isError } = useMe();

  const user = data?.data;

  useEffect(() => {
    if (!isLoading && (!user || isError)) {
      router.replace("/login");
    }
  }, [isLoading, user, isError, router]);

  if (isLoading || !user) {
    return <FullScreenLoader offsetTop={60} />;
  }

  return (
    <Container className="pt-3 pb-6">
      <div className="space-y-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs}>
          {(item) => (
            <BreadcrumbsItem href={item.href}>{item.label}</BreadcrumbsItem>
          )}
        </Breadcrumbs>

        {/* Page content */}
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar />

          <div className="w-full lg:w-[70%]">{children}</div>
        </div>
      </div>
    </Container>
  );
}
