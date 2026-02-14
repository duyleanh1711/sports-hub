"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";

import { login } from "@/actions/auth";
import { useAuthStore } from "@/stores/auth";
import type { LoginPayload } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const t = useTranslations("auth.login");

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),

    onSuccess: (user) => {
      toast.success(t("toast.success"));
      setUser(user);
      router.replace("/admin/dashboard");
    },

    onError: (error: any) => {
      const code = error.message?.replace("AUTH_", "")?.toLowerCase();

      toast.error(
        t(`toast.failed.${code}`, {
          defaultValue: t("toast.failed.default"),
        }),
      );
    },
  });
}
