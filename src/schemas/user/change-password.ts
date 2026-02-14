import { z } from "zod";

export const changePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      old_password: z.string().min(1, t("validation.current.required")),

      new_password: z
        .string()
        .min(8, t("validation.new.min"))
        .max(64, t("validation.new.max"))
        .regex(/[a-z]/, t("validation.new.lowercase"))
        .regex(/[A-Z]/, t("validation.new.uppercase"))
        .regex(/[0-9]/, t("validation.new.number"))
        .regex(/[^A-Za-z0-9]/, t("validation.new.special")),

      confirm_password: z.string().min(1, t("validation.confirm.required")),
    })
    .superRefine((data, ctx) => {
      if (data.confirm_password !== data.new_password) {
        ctx.addIssue({
          path: ["confirm_password"],
          message: t("validation.confirm.notMatch"),
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.old_password === data.new_password) {
        ctx.addIssue({
          path: ["new_password"],
          message: t("validation.new.sameAsCurrent"),
          code: z.ZodIssueCode.custom,
        });
      }
    });

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
