"use client";

import Image from "next/image";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { Form } from "react-aria-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Autocomplete, Popover, useFilter } from "react-aria-components";

import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/schemas/user/create";
import { findNameByCode } from "@/utils/address/find-name-by-code";
import { LOCALE_OPTIONS, USER_STATUS_OPTIONS } from "@/config.global";

import { useCreateUser } from "@/react-query/mutation/user";
import { useCountries, useProvinces, useWards } from "@/react-query/query/area";

import {
  Modal,
  ModalBody,
  ModalTitle,
  ModalClose,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalDescription,
} from "@/components/ui/modal";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Dialog } from "@/components/ui/dialog";
import { ListBox } from "@/components/ui/list-box";
import { TextField } from "@/components/ui/text-field";
import { RequiredLabel } from "@/components/shared/required-label";
import { Checkbox, CheckboxLabel } from "@/components/ui/checkbox";
import { Label, Fieldset, FieldError } from "@/components/ui/field";
import { SearchField, SearchInput } from "@/components/ui/search-field";

export function CreateUserModal({ children }: { children: ReactElement }) {
  const [open, setOpen] = useState(false);

  const tLanguage = useTranslations("language");
  const tStatus = useTranslations("admin.account.status");
  const t = useTranslations("admin.account.modals.create");

  const { contains } = useFilter({ sensitivity: "base" });

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema(t)),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      fullname: "",
      password: "",
      email: "",
      phone: "",
      status: "active",
      locale: "vi-VN",
      is_superuser: false,
      country_code: null,
      province: null,
      ward: null,
      address: "",
    },
  });

  const provinceCode = watch("province");
  const provinceCodeNumber =
    provinceCode !== null && provinceCode !== undefined
      ? Number(provinceCode)
      : undefined;

  const { data: countries = [] } = useCountries();
  const selectedCountry = countries.find(
    (c) => c.code === watch("country_code"),
  );

  const { data: provinces = [] } = useProvinces();
  const { data: wards = [] } = useWards(provinceCodeNumber);

  useEffect(() => {
    setValue("ward", null);
  }, [setValue]);

  const countryCode = watch("country_code");
  const isVietnam = countryCode === "VN";

  const { mutate, isPending } = useCreateUser(t, () => {
    reset();
    setOpen(false);
  });

  const onSubmit = (values: CreateUserFormValues) => {
    const callingCode = selectedCountry?.callingCode;
    const phone =
      values.phone && callingCode ? `${callingCode} ${values.phone}` : null;

    const provinceName = findNameByCode(provinces, values.province);
    const wardName = findNameByCode(wards, values.ward);

    const payload = {
      ...values,
      phone,
      ward: wardName,
      province: provinceName,
      email: values.email || null,
      locale: values.locale ?? "vi-VN",
    };

    mutate(payload);
  };

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      {children}

      <ModalContent className="max-w-2xl!">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <ModalTitle>{t("title")}</ModalTitle>
            <ModalDescription>{t("description")}</ModalDescription>
          </ModalHeader>

          <ModalBody className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
            <Fieldset>
              {/* Superuser */}
              <Controller
                name="is_superuser"
                control={control}
                render={({ field }) => (
                  <Checkbox isSelected={field.value} onChange={field.onChange}>
                    <CheckboxLabel>{t("fields.isSuperuser")}</CheckboxLabel>
                  </Checkbox>
                )}
              />

              {/* Fullname */}
              <Controller
                name="fullname"
                control={control}
                render={({ field }) => (
                  <TextField isInvalid={!!errors.fullname}>
                    <RequiredLabel>{t("fields.fullname")}</RequiredLabel>
                    <Input
                      {...field}
                      placeholder={t("placeholders.fullname")}
                    />
                    <FieldError>{errors.fullname?.message}</FieldError>
                  </TextField>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField isInvalid={!!errors.password}>
                    <RequiredLabel>{t("fields.password")}</RequiredLabel>
                    <Input
                      type="password"
                      {...field}
                      placeholder={t("placeholders.password")}
                    />

                    <FieldError>{errors.password?.message}</FieldError>
                  </TextField>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField isInvalid={!!errors.email}>
                    <Label>{t("fields.email")}</Label>
                    <Input
                      type="email"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder={t("placeholders.email")}
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                  </TextField>
                )}
              />

              {/* Phone */}
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
                      <Controller
                        name="country_code"
                        control={control}
                        render={({ field }) => {
                          return (
                            <div className="w-full sm:w-fit">
                              <Select
                                selectedKey={field.value ?? undefined}
                                onSelectionChange={field.onChange}
                                placeholder={t("placeholders.country")}
                              >
                                <SelectTrigger />

                                <Popover className="flex max-h-80 flex-col overflow-hidden rounded-lg border bg-overlay">
                                  <Dialog aria-label="Country">
                                    <Autocomplete filter={contains}>
                                      {/* Search */}
                                      <div className="border-b bg-muted p-2">
                                        <SearchField autoFocus>
                                          <SearchInput
                                            placeholder={t(
                                              "placeholders.searchCountry",
                                            )}
                                          />
                                        </SearchField>
                                      </div>

                                      {/* List */}
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
                                                className="h-4 w-6 object-cover rounded-sm"
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
                          );
                        }}
                      />

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

              {/* Country */}
              <Controller
                name="country_code"
                control={control}
                render={({ field }) => {
                  const selectedCountry = countries.find(
                    (c) => c.code === field.value,
                  );

                  return (
                    <TextField isInvalid={!!errors.country_code}>
                      <Select
                        selectedKey={field.value ?? undefined}
                        onSelectionChange={field.onChange}
                        placeholder={t("placeholders.country")}
                      >
                        <Label>{t("fields.country")}</Label>

                        <SelectTrigger>
                          {selectedCountry ? (
                            <div className="flex items-center gap-2">
                              <Image
                                src={selectedCountry.flag}
                                alt={selectedCountry.name}
                                width={24}
                                height={16}
                                className="h-4 w-6 object-cover rounded-sm"
                              />
                              <span className="truncate">
                                {selectedCountry.name}
                              </span>
                            </div>
                          ) : null}
                        </SelectTrigger>

                        <Popover className="flex max-h-80 w-(--trigger-width) flex-col overflow-hidden rounded-lg border bg-overlay">
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

                              <ListBox items={countries}>
                                {(item) => (
                                  <SelectItem
                                    id={item.code}
                                    textValue={item.name}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Image
                                        src={item.flag}
                                        alt={item.name}
                                        width={20}
                                        height={14}
                                        className="rounded-sm"
                                      />
                                      <span className="flex-1 truncate">
                                        {item.name}
                                      </span>
                                    </div>
                                  </SelectItem>
                                )}
                              </ListBox>
                            </Autocomplete>
                          </Dialog>
                        </Popover>
                      </Select>

                      <FieldError>{errors.country_code?.message}</FieldError>
                    </TextField>
                  );
                }}
              />

              {/* Vietnam only */}
              {isVietnam && (
                <div className="grid grid-cols-2 gap-3">
                  {/* Province */}
                  <Controller
                    name="province"
                    control={control}
                    render={({ field }) => (
                      <TextField isInvalid={!!errors.province}>
                        <Select
                          selectedKey={field.value ?? undefined}
                          onSelectionChange={field.onChange}
                          placeholder={t("placeholders.province")}
                        >
                          <Label>{t("fields.province")}</Label>
                          <SelectTrigger />
                          <SelectContent>
                            {provinces.map((p) => (
                              <SelectItem id={String(p.code)} key={p.code}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FieldError>{errors.province?.message}</FieldError>
                      </TextField>
                    )}
                  />

                  {/* Ward */}
                  <Controller
                    name="ward"
                    control={control}
                    render={({ field }) => (
                      <TextField isInvalid={!!errors.ward}>
                        <Select
                          isDisabled={!provinceCode}
                          selectedKey={field.value ?? undefined}
                          onSelectionChange={field.onChange}
                          placeholder={t("placeholders.ward")}
                        >
                          <Label>{t("fields.ward")}</Label>
                          <SelectTrigger />
                          <SelectContent>
                            {wards.map((w) => (
                              <SelectItem id={String(w.code)} key={w.code}>
                                {w.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FieldError>{errors.ward?.message}</FieldError>
                      </TextField>
                    )}
                  />
                </div>
              )}

              {/* Address */}
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField>
                    <Label>{t("fields.address")}</Label>
                    <Input
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder={t("placeholders.address")}
                    />
                  </TextField>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField isInvalid={!!errors.status}>
                      <Select
                        selectedKey={field.value}
                        onSelectionChange={field.onChange}
                      >
                        <RequiredLabel>{t("fields.status")}</RequiredLabel>
                        <SelectTrigger />
                        <SelectContent>
                          {USER_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status.key} id={status.key}>
                              {tStatus(status.i18nKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FieldError>{errors.status?.message}</FieldError>
                    </TextField>
                  )}
                />

                {/* Locale */}
                <Controller
                  name="locale"
                  control={control}
                  render={({ field }) => (
                    <TextField isInvalid={!!errors.locale}>
                      <Select
                        selectedKey={field.value}
                        onSelectionChange={field.onChange}
                      >
                        <Label>{t("fields.locale")}</Label>
                        <SelectTrigger />
                        <SelectContent>
                          {LOCALE_OPTIONS.map((locale) => (
                            <SelectItem key={locale.key} id={locale.key}>
                              {tLanguage(locale.languageKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FieldError>{errors.locale?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>
            </Fieldset>
          </ModalBody>

          <ModalFooter className="sticky bottom-0 z-10 px-6 py-4">
            <ModalClose>{t("actions.cancel")}</ModalClose>

            <Button type="submit" intent="primary" isDisabled={isPending}>
              {isPending && <Loader variant="ring" className="size-4" />}
              {t("actions.submit")}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}
