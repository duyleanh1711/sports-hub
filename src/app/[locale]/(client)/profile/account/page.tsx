"use client";

import Image from "next/image";
import { useEffect } from "react";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Autocomplete, Popover, useFilter } from "react-aria-components";

import { findNameByCode } from "@/utils/address/find-name-by-code";
import { findCodeByName } from "@/utils/address/find-code-by-name";

import { profileSchema, type ProfileFormValues } from "@/schemas/user/profile";

import { useMe } from "@/react-query/query/user";
import { useUpdateMe } from "@/react-query/mutation/user";
import { useCountries, useProvinces, useWards } from "@/react-query/query/area";

import { RequiredLabel } from "@/components/shared/required-label";

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ListBox } from "@/components/ui/list-box";
import { TextField } from "@/components/ui/text-field";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { Fieldset, Legend, Label, FieldError } from "@/components/ui/field";

import { ChangeEmailModal } from "@/components/modals/profile/change-email";
import { ChangePhoneModal } from "@/components/modals/profile/change-phone";

export default function AccountPage() {
  const { data, isPending: isFetchingMe } = useMe();
  const user = data?.data;

  const t = useTranslations("profile.account");

  const { contains } = useFilter({ sensitivity: "base" });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema(t)),
    defaultValues: {
      fullname: "",
      country_code: null,
      province: null,
      ward: null,
      address: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      fullname: user.fullname ?? "",
      country_code: user.country_code ?? null,
      address: user.address ?? "",
      province: null,
      ward: null,
    });
  }, [user, reset]);

  const countryCode = watch("country_code");
  const provinceCode = watch("province");

  const provinceCodeNumber =
    provinceCode != null ? Number(provinceCode) : undefined;

  const isVietnam = countryCode === "VN";

  const { data: countries = [] } = useCountries();
  const selectedCountry = countries.find(
    (c) => c.code === watch("country_code"),
  );

  const { data: provinces = [] } = useProvinces();
  const { data: wards = [] } = useWards(provinceCodeNumber);

  useEffect(() => {
    if (!user?.province || !provinces.length) return;

    const provinceCode = findCodeByName(provinces, user.province);
    setValue("province", provinceCode);
  }, [user?.province, provinces, setValue]);

  useEffect(() => {
    if (!user?.ward || !wards.length) return;

    const wardCode = findCodeByName(wards, user.ward);
    setValue("ward", wardCode);
  }, [user?.ward, wards, setValue]);

  useEffect(() => {
    setValue("ward", null);
  }, [setValue]);

  const { mutate, isPending: isUpdatingMe } = useUpdateMe(t);

  const onSubmit = (values: ProfileFormValues) => {
    const payload: Partial<ProfileFormValues> = {};

    if (dirtyFields.fullname) payload.fullname = values.fullname;
    if (dirtyFields.address) payload.address = values.address;
    if (dirtyFields.country_code) payload.country_code = values.country_code;

    if (dirtyFields.province && values.province) {
      payload.province = findNameByCode(provinces, values.province);
    }

    if (dirtyFields.ward && values.ward) {
      payload.ward = findNameByCode(wards, values.ward);
    }

    if (Object.keys(payload).length === 0) return;

    mutate(payload);
  };

  if (isFetchingMe) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader variant="ring" className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-muted-foreground">{t("title")}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Fieldset className="space-y-4">
          <Legend className="sr-only">{t("title")}</Legend>

          {/* Fullname */}
          <Controller
            name="fullname"
            control={control}
            render={({ field }) => (
              <TextField isInvalid={!!errors.fullname}>
                <RequiredLabel>{t("fields.fullname")}</RequiredLabel>
                <Input {...field} placeholder={t("placeholders.fullname")} />
                <FieldError>{errors.fullname?.message}</FieldError>
              </TextField>
            )}
          />

          {/* Email (readonly) */}
          <TextField>
            <Label>{t("fields.email")}</Label>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input value={user?.email ?? ""} disabled className="flex-1" />

              <ChangeEmailModal>
                <Button
                  type="button"
                  intent="outline"
                  onPress={() => {}}
                  className="w-full sm:w-48 shrink-0 flex items-center gap-2"
                >
                  <EnvelopeIcon className="size-4" />
                  {t("actions.changeEmail")}
                </Button>
              </ChangeEmailModal>
            </div>
          </TextField>

          {/* Phone (readonly) */}
          <TextField>
            <Label>{t("fields.phone")}</Label>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Phone display */}
              <div className="w-full sm:flex-1 flex">
                {/* Prefix: flag + calling code */}
                <div className="flex min-w-22 items-center justify-center gap-2 rounded-l-md border border-r-0 bg-muted px-3 text-sm">
                  {selectedCountry?.flag && (
                    <Image
                      src={selectedCountry.flag}
                      alt={selectedCountry.name}
                      width={20}
                      height={14}
                      className="h-4 w-6 rounded-sm object-cover"
                      unoptimized
                    />
                  )}

                  <span className="text-muted-foreground">
                    {selectedCountry?.callingCode || "+"}
                  </span>
                </div>

                {/* Phone number */}
                <Input
                  value={user?.phone ?? ""}
                  disabled
                  className="rounded-l-none"
                />
              </div>

              {/* Action */}
              <ChangePhoneModal>
                <Button
                  type="button"
                  intent="outline"
                  onPress={() => {}}
                  className="w-full sm:w-48 shrink-0 flex items-center gap-2"
                >
                  <PhoneIcon className="size-4" />
                  {t("actions.changePhone")}
                </Button>
              </ChangePhoneModal>
            </div>
          </TextField>

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
                      {selectedCountry && (
                        <div className="flex items-center gap-2">
                          <Image
                            src={selectedCountry.flag}
                            alt={selectedCountry.name}
                            width={24}
                            height={16}
                            className="h-4 w-6 rounded-sm object-cover"
                          />
                          <span className="truncate">
                            {selectedCountry.name}
                          </span>
                        </div>
                      )}
                    </SelectTrigger>

                    <Popover className="flex max-h-80 w-(--trigger-width) flex-col overflow-hidden rounded-lg border bg-overlay">
                      <Dialog aria-label="Country">
                        <Autocomplete filter={contains}>
                          <div className="border-b bg-muted p-2">
                            <SearchField autoFocus>
                              <SearchInput
                                placeholder={t("placeholders.searchCountry")}
                              />
                            </SearchField>
                          </div>

                          <ListBox items={countries}>
                            {(item) => (
                              <SelectItem id={item.code} textValue={item.name}>
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={item.flag}
                                    alt={item.name}
                                    width={20}
                                    height={14}
                                    className="rounded-sm"
                                  />
                                  <span className="truncate">{item.name}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <TextField isInvalid={!!errors.address}>
                <Label>{t("fields.address")}</Label>
                <Input
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={t("placeholders.address")}
                />
                <FieldError>{errors.address?.message}</FieldError>
              </TextField>
            )}
          />
        </Fieldset>

        <div className="ml-auto">
          <Button type="submit" isDisabled={!isDirty || isUpdatingMe}>
            {isUpdatingMe && <Loader variant="ring" className="size-4" />}
            {isUpdatingMe ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
