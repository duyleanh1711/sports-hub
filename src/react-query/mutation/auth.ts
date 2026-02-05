import { useMutation } from "@tanstack/react-query";

import { loginAction } from "@/actions/auth";
import type { LoginPayload } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginAction(payload),
  });
}
