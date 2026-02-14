"use client";

import { usePathname } from "next/navigation";

type Breadcrumb = {
  id: string;
  label: string;
  href?: string;
};

export function useBreadcrumbs(t: (key: string) => string) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const [, ...rest] = segments;

  const breadcrumbs: Breadcrumb[] = [
    {
      id: "home",
      label: t("home"),
      href: "/",
    },
  ];

  rest.forEach((segment, index) => {
    // biome-ignore lint/style/useTemplate: <explanation>
    const href = "/" + rest.slice(0, index + 1).join("/");
    breadcrumbs.push({
      id: segment,
      label: t(segment),
      href: index === rest.length - 1 ? undefined : href,
    });
  });

  return breadcrumbs;
}
