import { z } from "zod";

export const updateUserSchema = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  t: (key: string, values?: Record<string, any>) => string,
) =>
  z.object({
    fullname: z.string().min(1, t("validation.fullname.required")),

    country_code: z.string().nullable().optional(),

    province: z.string().nullable().optional(),

    ward: z.string().nullable().optional(),

    address: z.string().nullable().optional(),

    locale: z.enum(["en-US", "vi-VN"]).optional(),
  });

export type UpdateUserFormValues = z.input<ReturnType<typeof updateUserSchema>>;
