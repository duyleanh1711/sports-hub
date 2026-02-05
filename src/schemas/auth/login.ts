import { z } from "zod";

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),

    password: z
      .string()
      .min(8, t("validation.passwordMin"))
      .regex(/[a-z]/, t("validation.passwordLowercase"))
      .regex(/[A-Z]/, t("validation.passwordUppercase"))
      .regex(/[0-9]/, t("validation.passwordNumber"))
      .regex(/[^a-zA-Z0-9]/, t("validation.passwordSpecial")),

    remember: z.boolean().optional(),
  });

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;
