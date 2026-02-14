"use client";

import Image from "next/image";
import { type ReactNode, useState } from "react";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, Form, Popover, useFilter } from "react-aria-components";

import {
  changePhoneSchema,
  type ChangePhoneFormValues,
} from "@/schemas/user/change-phone";
import { useCountdown } from "@/hooks/use-countdown";

import { useCountries } from "@/react-query/query/area";
import { useUpdateMyPhone } from "@/react-query/mutation/user";

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
import { Dialog } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { ListBox } from "@/components/ui/list-box";
import { TextField } from "@/components/ui/text-field";
import { FieldError, Label } from "@/components/ui/field";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";

export function ChangePhoneModal({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const [phoneSnapshot, setPhoneSnapshot] = useState("");
  const [countryCode, setCountryCode] = useState<string>("VN");

  const { contains } = useFilter({ sensitivity: "base" });

  const t = useTranslations("profile.modals.changePhone");

  const {
    control,
    getValues,
    resetField,
    handleSubmit,
    reset: formReset,
    formState: { errors },
  } = useForm<ChangePhoneFormValues>({
    resolver: zodResolver(changePhoneSchema(t, step)),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      phone: "",
      otp: "",
    },
  });

  const { data: countries = [] } = useCountries();
  const selectedCountry = countries.find((c) => c.code === countryCode);

  const fullPhone = `${selectedCountry?.callingCode || "+84"} ${phoneSnapshot}`;

  const { seconds, isCounting, start, reset } = useCountdown(60);

  const backToPhone = () => {
    reset();
    resetField("otp");
    setStep("phone");
  };

  const resendOtp = async () => {
    if (isCounting) return;

    console.log("Resend OTP to:", phoneSnapshot);
    start();
  };

  const requestOtp = async () => {
    const phone = getValues("phone");
    if (!phone) return;

    console.log("Send OTP to:", phone);

    setPhoneSnapshot(phone);
    resetField("otp");
    setStep("otp");
    start();
  };

  const { mutate, isPending } = useUpdateMyPhone(t, () => {
    setOpen(false);
    setStep("phone");
    formReset();
  });

  const verifyOtp = async (values: ChangePhoneFormValues) => {
    const callingCode = selectedCountry?.callingCode || "+84";
    const fullPhone = `${callingCode} ${phoneSnapshot}`;

    mutate({
      otp: values.otp,
      new_phone: fullPhone,
    });
  };

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      {children}

      <ModalContent className="min-w-full sm:min-w-lg">
        <Form
          onSubmit={handleSubmit(step === "phone" ? requestOtp : verifyOtp)}
        >
          <ModalHeader className="pb-0">
            <ModalTitle>{t("title")}</ModalTitle>

            <ModalDescription>
              {step === "phone"
                ? t("description")
                : t.rich("otpDescription", {
                    phone: fullPhone,
                    highlight: (chunks) => (
                      <span className="text-primary font-medium">{chunks}</span>
                    ),
                  })}
            </ModalDescription>
          </ModalHeader>

          <ModalBody>
            {step === "phone" && (
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    isInvalid={!!errors.phone}
                    aria-label={t("fields.phone")}
                  >
                    <Label>{t("fields.phone")}</Label>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* Country select */}
                      <div className="w-full sm:w-fit">
                        <Select
                          selectedKey={countryCode}
                          onSelectionChange={(key) =>
                            setCountryCode(key as string)
                          }
                          placeholder={t("placeholders.country")}
                        >
                          <SelectTrigger />

                          <Popover className="flex max-h-80 flex-col overflow-hidden rounded-lg border bg-overlay">
                            <Dialog aria-label="Country">
                              <Autocomplete filter={contains}>
                                <div className="border-b bg-muted p-2">
                                  <SearchField autoFocus>
                                    <SearchInput
                                      placeholder={t(
                                        "placeholders.searchCountry",
                                      )}
                                    />
                                  </SearchField>
                                </div>

                                <ListBox
                                  items={countries}
                                  className="max-h-[inherit] min-w-[inherit] rounded-t-none border-0 bg-transparent shadow-none"
                                >
                                  {(item) => (
                                    <SelectItem
                                      id={item.code}
                                      key={item.code}
                                      textValue={`${item.name} ${item.callingCode}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Image
                                          src={item.flag}
                                          alt={item.name}
                                          width={24}
                                          height={16}
                                          className="h-4 w-6 rounded-sm object-cover"
                                          unoptimized
                                        />
                                        <span className="flex-1 truncate">
                                          {item.name}
                                        </span>
                                        <span className="text-muted-foreground">
                                          {item.callingCode}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  )}
                                </ListBox>
                              </Autocomplete>
                            </Dialog>
                          </Popover>
                        </Select>
                      </div>

                      {/* Phone input */}
                      <div className="flex flex-1">
                        <div className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm">
                          {selectedCountry?.callingCode || "+"}
                        </div>

                        <Input
                          className="rounded-l-none"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder={t("placeholders.phone")}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      </div>
                    </div>

                    <FieldError>{errors.phone?.message}</FieldError>
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
                  onPress={backToPhone}
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
              {step === "phone" ? t("actions.sendOtp") : t("actions.verify")}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}
