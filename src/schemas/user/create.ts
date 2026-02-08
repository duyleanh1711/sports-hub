import { z } from "zod";

export const createUserSchema = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  t: (key: string, values?: Record<string, any>) => string,
) =>
  z
    .object({
      fullname: z.string().min(1, t("validation.fullname.required")),

      password: z
        .string()
        .min(8, t("validation.password.min", { min: 8 }))
        .regex(/[a-z]/, t("validation.password.lowercase"))
        .regex(/[A-Z]/, t("validation.password.uppercase"))
        .regex(/[0-9]/, t("validation.password.number"))
        .regex(/[^a-zA-Z0-9]/, t("validation.password.special")),

      status: z.enum(["active", "inactive", "suspended", "banned", "pending"]),

      email: z
        .string()
        .nullable()
        .optional()
        .refine(
          (value) => {
            if (!value) return true;
            return z.string().email().safeParse(value).success;
          },
          { message: t("validation.email.invalid") },
        ),

      phone: z
        .string()
        .nullable()
        .optional()
        .refine(
          (value) => {
            if (!value) return true;
            return /^(?!84)\d{6,15}$/.test(value);
          },
          { message: t("validation.phone.invalid") },
        ),

      is_superuser: z.boolean().optional().default(false),

      country_code: z.string().nullable().optional(),
      province: z.string().nullable().optional(),
      ward: z.string().nullable().optional(),
      address: z.string().nullable().optional(),

      locale: z.enum(["en-US", "vi-VN"]).default("vi-VN"),
    })
    .superRefine((data, ctx) => {
      const hasEmail = !!data.email;
      const hasPhone = !!data.phone;

      if (!hasEmail && !hasPhone) {
        ctx.addIssue({
          path: ["email"],
          message: t("validation.emailOrPhone.required"),
          code: z.ZodIssueCode.custom,
        });

        ctx.addIssue({
          path: ["phone"],
          message: t("validation.emailOrPhone.required"),
          code: z.ZodIssueCode.custom,
        });
      }
    });

export type CreateUserSchema = ReturnType<typeof createUserSchema>;

export type CreateUserFormValues = z.input<CreateUserSchema>;
export type CreateUserPayload = z.infer<CreateUserSchema>;
