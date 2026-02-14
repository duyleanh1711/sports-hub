import { z } from "zod";

export type ChangeEmailStep = "email" | "otp";

export const changeEmailSchema = (
  t: (key: string) => string,
  step: ChangeEmailStep,
) =>
  z
    .object({
      email: z.string(),
      otp: z.string(),
    })
    .superRefine((data, ctx) => {
      if (step === "email") {
        if (data.email.trim() === "") {
          ctx.addIssue({
            path: ["email"],
            message: t("validation.email.required"),
            code: z.ZodIssueCode.custom,
          });
          return;
        }

        if (!z.string().trim().email().safeParse(data.email).success) {
          ctx.addIssue({
            path: ["email"],
            message: t("validation.email.invalid"),
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

export type ChangeEmailFormValues = z.infer<
  ReturnType<typeof changeEmailSchema>
>;
