import { z } from "zod";

export type ChangePhoneStep = "phone" | "otp";

export const changePhoneSchema = (
  t: (key: string) => string,
  step: ChangePhoneStep,
) =>
  z
    .object({
      phone: z.string(),
      otp: z.string(),
    })
    .superRefine((data, ctx) => {
      if (step === "phone") {
        if (data.phone.trim() === "") {
          ctx.addIssue({
            path: ["phone"],
            message: t("validation.phone.required"),
            code: z.ZodIssueCode.custom,
          });
          return;
        }

        const phoneWithoutPrefix = data.phone.slice(2);

        if (!/^\d{6,13}$/.test(phoneWithoutPrefix)) {
          ctx.addIssue({
            path: ["phone"],
            message: t("validation.phone.invalid"),
            code: z.ZodIssueCode.custom,
          });
        }
      }

      if (step === "otp") {
        if (data.otp.trim() === "") {
          ctx.addIssue({
            path: ["otp"],
            message: t("validation.otp.required"),
            code: z.ZodIssueCode.custom,
          });
          return;
        }

        if (data.otp.length !== 6) {
          ctx.addIssue({
            path: ["otp"],
            message: t("validation.otp.invalid"),
            code: z.ZodIssueCode.custom,
          });
        }
      }
    });

export type ChangePhoneFormValues = z.infer<
  ReturnType<typeof changePhoneSchema>
>;
