import { z } from "zod";

export const profileSchema = (t: (key: string) => string) =>
  z.object({
    fullname: z.string().min(1, t("validation.fullname.required")),

    phone: z.string().optional().nullable(),

    country_code: z.string().nullable().optional(),

    province: z.string().nullable().optional(),

    ward: z.string().nullable().optional(),

    address: z.string().nullable().optional(),
  });

export type ProfileFormValues = z.infer<ReturnType<typeof profileSchema>>;
