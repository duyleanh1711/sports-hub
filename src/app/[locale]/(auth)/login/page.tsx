"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Form } from "react-aria-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { getCaptchaToken } from "@/lib/recaptcha";
import { useLogin } from "@/react-query/mutation/auth";
import { loginSchema, type LoginFormValues } from "@/schemas/auth/login";

import {
  Label,
  Legend,
  Fieldset,
  FieldError,
  Description,
} from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/components/ui/link";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Text, TextLink } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { Checkbox, CheckboxLabel } from "@/components/ui/checkbox";

import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth.login");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema(t)),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const { mutate, isPending } = useLogin();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (data: LoginFormValues) => {
    const captcha_token = await getCaptchaToken(executeRecaptcha);

    mutate(
      {
        email: data.email,
        password: data.password,
        captcha_token,
      },
      {
        onSuccess: (user) => {
          toast.success(t("toast.success"));
          router.replace(user.is_superuser ? "/admin/dashboard" : "/");
        },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onError: (error: any) => {
          const rawCode = error?.response?.data?.code;
          const code = rawCode?.replace("AUTH_", "")?.toLowerCase();

          toast.error(
            t(`toast.failed.${code}`, {
              defaultValue: t("toast.failed.default"),
            }),
          );
        },
      },
    );
  };

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <ThemeSwitcher appearance="outline" shape="square" />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        <h1 className="sr-only">{t("title")}</h1>

        {/* Home */}
        <Tooltip delay={0}>
          <TooltipTrigger aria-label={t("home")}>
            <Link href="/" className="mb-3 inline-block">
              <Avatar
                isSquare
                src="https://design.intentui.com/logo"
                size="md"
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent>{t("home")}</TooltipContent>
        </Tooltip>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <Legend className="text-xl/6">{t("title")}</Legend>

            <Text>{t("description")}</Text>

            {/* Email */}
            <TextField isRequired isInvalid={!!errors.email}>
              <Label>{t("email")}</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </TextField>

            {/* Password */}
            <TextField isRequired isInvalid={!!errors.password}>
              <div className="mb-2 flex items-center justify-between">
                <Label>{t("password")}</Label>
                <TextLink
                  href="/forgot-password"
                  className="text-base/6 sm:text-sm/6"
                >
                  {t("forgot")}
                </TextLink>
              </div>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </TextField>

            {/* Remember */}
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox isSelected={field.value} onChange={field.onChange}>
                  <CheckboxLabel>{t("remember")}</CheckboxLabel>
                  <Description>{t("rememberDesc")}</Description>
                </Checkbox>
              )}
            />
          </Fieldset>

          <Button
            size="lg"
            type="submit"
            className="mt-6 w-full"
            isDisabled={isPending}
          >
            {isPending ? (
              <Loader variant="ring" className="size-5" />
            ) : (
              t("submit")
            )}
          </Button>

          <div className="mt-4 text-center">
            <Text>
              {t("noAccount")}{" "}
              <TextLink href="/register">{t("register")}</TextLink>
            </Text>
          </div>
        </Form>
      </div>
    </main>
  );
}
