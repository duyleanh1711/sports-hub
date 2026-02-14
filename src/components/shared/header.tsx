"use client";

import { useTranslations } from "next-intl";

import { useAuthStore } from "@/stores/auth";

import { Container } from "./container";
import { UserButton } from "./user-button";

import { Link } from "../ui/link";
import { Avatar } from "../ui/avatar";
import { Loader } from "../ui/loader";
import { buttonStyles } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function Header() {
  const t = useTranslations("home.header");
  const { user, isPending } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Tooltip delay={0}>
            <TooltipTrigger aria-label={t("home")}>
              <Link href="/" className="flex items-center gap-x-2">
                <Avatar
                  isSquare
                  src="https://design.intentui.com/logo"
                  size="md"
                />
                <p>
                  Intent <span className="text-muted-fg">UI</span>
                </p>
              </Link>
            </TooltipTrigger>
            <TooltipContent>{t("home")}</TooltipContent>
          </Tooltip>

          {isPending ? (
            <Loader variant="ring" className="size-5 text-primary" />
          ) : user ? (
            <UserButton />
          ) : (
            <Link href="/login" className={buttonStyles({ intent: "primary" })}>
              {t("login")}
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
