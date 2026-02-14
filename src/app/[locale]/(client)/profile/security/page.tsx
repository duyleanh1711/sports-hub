"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schemas/user/change-password";
import { useUpdateMyPassword } from "@/react-query/mutation/user";

import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { TextField } from "@/components/ui/text-field";

import { RequiredLabel } from "@/components/shared/required-label";

export default function SecurityPage() {
  const t = useTranslations("profile.security.changePassword");

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema(t)),
    mode: "onChange",
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const { mutate, isPending } = useUpdateMyPassword(t, () => reset());

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutate({
      old_password: values.old_password,
      new_password: values.new_password,
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-muted-foreground">{t("title")}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="old_password"
          control={control}
          render={({ field }) => (
            <TextField isInvalid={!!errors.old_password}>
              <RequiredLabel>{t("fields.current")}</RequiredLabel>
              <Input
                {...field}
                type="password"
                placeholder={t("placeholders.current")}
              />
              <FieldError>{errors.old_password?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="new_password"
          control={control}
          render={({ field }) => (
            <TextField isInvalid={!!errors.new_password}>
              <RequiredLabel>{t("fields.new")}</RequiredLabel>
              <Input
                {...field}
                type="password"
                placeholder={t("placeholders.new")}
              />
              <FieldError>{errors.new_password?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="confirm_password"
          control={control}
          render={({ field }) => (
            <TextField isInvalid={!!errors.confirm_password}>
              <RequiredLabel>{t("fields.confirm")}</RequiredLabel>
              <Input
                {...field}
                type="password"
                placeholder={t("placeholders.confirm")}
              />
              <FieldError>{errors.confirm_password?.message}</FieldError>
            </TextField>
          )}
        />

        <Button
          type="submit"
          intent="primary"
          isDisabled={isPending}
          className="ml-auto gap-2"
        >
          {isPending && <Loader variant="ring" className="size-4" />}
          {isPending ? t("actions.saving") : t("actions.save")}
        </Button>
      </form>
    </div>
  );
}
