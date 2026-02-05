"use client";

import { Form } from "react-aria-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

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

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="sr-only">Đăng nhập</h1>

        <Tooltip delay={0}>
          <TooltipTrigger aria-label="Về trang chủ">
            <Link
              href="/"
              aria-label="Về trang chủ"
              className="mb-3 inline-block"
            >
              <Avatar
                isSquare
                src="https://design.intentui.com/logo"
                size="md"
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Về trang chủ</TooltipContent>
        </Tooltip>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <Legend className="text-xl/6">Đăng nhập</Legend>

            <Text>
              Đăng nhập để dễ dàng tìm sân, chọn khung giờ và đặt lịch chơi.
            </Text>

            {/* Email */}
            <TextField isRequired isInvalid={!!errors.email}>
              <Label>Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="Nhập địa chỉ email"
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
                <Label>Mật khẩu</Label>
                <TextLink
                  href="/forgot-password"
                  className="text-base/6 sm:text-sm/6"
                >
                  Quên mật khẩu?
                </TextLink>
              </div>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu"
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
                  <CheckboxLabel>Ghi nhớ đăng nhập</CheckboxLabel>
                  <Description>
                    Giữ trạng thái đăng nhập trên thiết bị này để truy cập nhanh
                    hơn lần sau.
                  </Description>
                </Checkbox>
              )}
            />
          </Fieldset>

          <Button
            size="lg"
            type="submit"
            className="mt-6 w-full"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? <Loader variant="ring" /> : "Đăng nhập"}
          </Button>

          <div className="mt-4 text-center">
            <Text>
              Chưa có tài khoản?{" "}
              <TextLink href="/register">Đăng ký ngay</TextLink>
            </Text>
          </div>
        </Form>
      </div>
    </main>
  );
}
