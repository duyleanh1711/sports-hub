"use client";

import Image from "next/image";
import { useEffect } from "react";

import { useTranslations } from "next-intl";
import { Form } from "react-aria-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Autocomplete, Popover, useFilter } from "react-aria-components";

import {
  updateUserSchema,
  type UpdateUserFormValues,
} from "@/schemas/user/update";
import { LOCALE_OPTIONS } from "@/config.global";
import { pickDirtyValues } from "@/utils/pick-dirty-values";

import { findCodeByName } from "@/utils/address/find-code-by-name";
import { findNameByCode } from "@/utils/address/find-name-by-code";

import { useUser } from "@/react-query/query/user";
import { useUpdateUser } from "@/react-query/mutation/user";
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
import { Label, Fieldset, FieldError } from "@/components/ui/field";
import { SearchField, SearchInput } from "@/components/ui/search-field";

type UpdateUserModalProps = {
  open: boolean;
  userId: string;
  onOpenChange: (open: boolean) => void;
};

export function UpdateUserModal({
  open,
  userId,
  onOpenChange,
}: UpdateUserModalProps) {
  const { data } = useUser(userId);
  const user = data?.data;

  const tLanguage = useTranslations("language");
  const t = useTranslations("admin.account.modals.update");

  const { contains } = useFilter({ sensitivity: "base" });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema(t)),
    defaultValues: {
      fullname: "",
      locale: "vi-VN",
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
      locale: (user.locale ?? "vi-VN") as "vi-VN" | "en-US",
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

  const { mutate, isPending } = useUpdateUser(t, () => onOpenChange(false));

  const onSubmit = (values: UpdateUserFormValues) => {
    const dirtyValues = pickDirtyValues(values, dirtyFields);

    if (dirtyValues.province) {
      dirtyValues.province = findNameByCode(provinces, values.province);
    }

    if (dirtyValues.ward) {
      dirtyValues.ward = findNameByCode(wards, values.ward);
    }

    mutate({
      userId,
      payload: dirtyValues,
    });
  };

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-xl!">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="sm:pb-0">
            <ModalTitle>{t("title")}</ModalTitle>
            <ModalDescription>{t("description")}</ModalDescription>
          </ModalHeader>

          <ModalBody className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
            <Fieldset>
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
                                width={20}
                                height={14}
                                className="rounded-sm"
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
                                        width={24}
                                        height={16}
                                        className="h-4 w-6 object-cover rounded-sm"
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
