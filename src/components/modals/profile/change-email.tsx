"use client";

import { ReactNode, useState } from "react";

import { useTranslations } from "next-intl";
import { Form } from "react-aria-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  changeEmailSchema,
  type ChangeEmailFormValues,
} from "@/schemas/user/change-email";
import { useCountdown } from "@/hooks/use-countdown";
import { useUpdateMyEmail } from "@/react-query/mutation/user";

import {
  Modal,
  ModalBody,
  ModalClose,
  ModalTitle,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalDescription,
} from "@/components/ui/modal";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPControl,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { TextField } from "@/components/ui/text-field";
import { FieldError, Label } from "@/components/ui/field";

export function ChangeEmailModal({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [emailSnapshot, setEmailSnapshot] = useState("");

  const t = useTranslations("profile.modals.changeEmail");

  const {
    control,
    getValues,
    resetField,
    handleSubmit,
    reset: formReset,
    formState: { errors },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema(t, step)),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const { seconds, isCounting, start, reset } = useCountdown(60);

  const backToEmail = () => {
    reset();
    resetField("otp");
    setStep("email");
  };

  const resendOtp = async () => {
    if (isCounting) return;

    console.log("Resend OTP to:", emailSnapshot);
    start();
  };

  const requestOtp = async () => {
    const email = getValues("email");

    if (!email) return;

    console.log("Send OTP to:", email);

    setEmailSnapshot(email);
    resetField("otp");
    setStep("otp");
    start();
  };

  const { mutate, isPending } = useUpdateMyEmail(t, () => {
    setOpen(false);
    setStep("email");
    formReset();
  });

  const verifyOtp = async (values: ChangeEmailFormValues) => {
    mutate({
      otp: values.otp,
      new_email: emailSnapshot,
    });
  };

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      {children}

      <ModalContent className="min-w-full sm:min-w-lg">
        <Form
          onSubmit={handleSubmit(step === "email" ? requestOtp : verifyOtp)}
        >
          <ModalHeader>
            <ModalTitle>{t("title")}</ModalTitle>

            <ModalDescription>
              {step === "email"
                ? t("description")
                : t.rich("otpDescription", {
                    email: emailSnapshot,
                    highlight: (chunks) => (
                      <span className="text-primary font-medium">{chunks}</span>
                    ),
                  })}
            </ModalDescription>
          </ModalHeader>

          <ModalBody>
            {step === "email" && (
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField isInvalid={!!errors.email}>
                    <Label>{t("fields.email")}</Label>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("placeholders.email")}
                      autoFocus
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                  </TextField>
                )}
              />
            )}

            {step === "otp" && (
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <TextField isInvalid={!!errors.otp}>
                    <Label>{t("fields.otp")}</Label>

                    <InputOTP
                      autoFocus
                      maxLength={6}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    >
                      <InputOTPControl>
                        <InputOTPGroup className="w-full">
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot
                              key={`otp-${i}`}
                              index={i}
                              className="flex-1 h-14 sm:h-17 text-xl!"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTPControl>
                    </InputOTP>

                    <FieldError>{errors.otp?.message}</FieldError>
                  </TextField>
                )}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <ModalClose>{t("actions.cancel")}</ModalClose>

            {step === "otp" && (
              <>
                <Button
                  type="button"
                  intent="plain"
                  onPress={backToEmail}
                  className="sm:mr-auto"
                >
                  {t("actions.back")}
                </Button>

                <Button
                  type="button"
                  intent="plain"
                  onPress={resendOtp}
                  isDisabled={isCounting}
                  className="text-primary"
                >
                  {isCounting
                    ? t("actions.resendOtpCountdown", { seconds })
                    : t("actions.resendOtp")}
                </Button>
              </>
            )}

            <Button type="submit" intent="primary" isDisabled={isPending}>
              {isPending && <Loader variant="ring" className="size-4" />}
              {step === "email" ? t("actions.sendOtp") : t("actions.verify")}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}
