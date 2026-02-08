"use client";

import { useTranslations } from "next-intl";

import { useAuthStore } from "@/stores/auth";

import { Link } from "@/components/ui/link";
import { Loader } from "@/components/ui/loader";
import { buttonStyles } from "@/components/ui/button";

import { UserButton } from "@/components/shared/user-button";

export default function Home() {
  const t = useTranslations("home.button");

  const { user, isPending } = useAuthStore();

  return (
    <main className="p-3">
      {isPending ? (
        <Loader variant="ring" className="size-5 text-primary" />
      ) : user ? (
        <UserButton />
      ) : (
        <Link href="/login" className={buttonStyles({ intent: "primary" })}>
          {t("login")}
        </Link>
      )}
    </main>
  );
}
