"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  ListBox,
  useFilter,
  SearchField,
  Autocomplete,
} from "react-aria-components";
import { cn } from "tailwind-variants";
import { useTranslations } from "next-intl";
import { FunnelIcon, TrashIcon } from "@heroicons/react/24/outline";

import { useCountries } from "@/react-query/query/area";
import { STATUS_OPTIONS } from "@/constants/status/status-options";

import { useDebounce } from "@/hooks/use-debounce";
import { useTextFilter } from "@/hooks/use-text-filter";
import { useMultiSelectFilter } from "@/hooks/use-multi-select-filter";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/ui/search-field";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";

export function AccountFilters() {
  const t = useTranslations("admin.account.filters");
  const { contains } = useFilter({ sensitivity: "base" });

  const { data: countries = [] } = useCountries();
  const [countryCode, setCountryCode] = useState<string | null>("VN");

  const phoneFilter = useTextFilter("phone");
  const statusFilter = useMultiSelectFilter("status");

  const [phone, setPhone] = useState("");
  const debouncedPhone = useDebounce(phone, 500);

  const selectedCountry = countries.find((c) => c.code === countryCode);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isClearingRef.current) return;

    if (!debouncedPhone) {
      phoneFilter.clear();
      return;
    }

    const callingCode = selectedCountry?.callingCode?.replace("+", "") ?? "";
    if (!callingCode) {
      phoneFilter.clear();
      return;
    }

    const normalizedPhone = debouncedPhone.startsWith("0")
      ? debouncedPhone.slice(1)
      : debouncedPhone;

    phoneFilter.set(`+${callingCode} ${normalizedPhone}`);
  }, [debouncedPhone, selectedCountry]);

  const isActive = statusFilter.isActive || phoneFilter.isActive;
  const count = statusFilter.count + (phoneFilter.isActive ? 1 : 0);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\D/g, ""));
  };

  const isClearingRef = useRef(false);

  const handleClearAll = () => {
    isClearingRef.current = true;

    statusFilter.clear();
    phoneFilter.clear();
    setPhone("");

    queueMicrotask(() => {
      isClearingRef.current = false;
    });
  };

  return (
    <Popover>
      <Tooltip delay={0}>
        <TooltipTrigger aria-label={t("title")}>
          <Button
            intent={isActive ? "secondary" : "outline"}
            size="lg"
            className={cn(
              count > 0
                ? "group bg-primary/10 text-primary hover:bg-primary/10"
                : "gap-2",
            )}
          >
            <FunnelIcon className="size-4 group-hover:text-primary!" />
            {count > 0 && <span className="text-xs font-medium">{count}</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("title")}</TooltipContent>
      </Tooltip>

      <PopoverContent arrow className="space-y-4 p-4 min-w-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{t("title")}</h3>

          {/* Clear all filters */}
          {isActive && (
            <Button size="md" intent="danger" onPress={handleClearAll}>
              <TrashIcon className="size-4" />
              {t("actions.clearAll")}
            </Button>
          )}
        </div>

        {/* Phone filter */}
        <div className="space-y-1">
          <div className="text-sm font-medium">{t("phone")}</div>

          <div className="flex gap-2">
            {/* Country selector */}
            <div className="w-fit">
              <Select
                selectedKey={countryCode ?? undefined}
                onSelectionChange={(key) => setCountryCode(key as string)}
                placeholder={t("placeholders.country")}
              >
                <SelectTrigger />

                <PopoverContent className="flex max-h-80 flex-col overflow-hidden rounded-lg border bg-overlay p-0">
                  <Dialog aria-label="Country">
                    <Autocomplete filter={contains}>
                      <div className="border-b bg-muted p-2">
                        <SearchField autoFocus>
                          <SearchInput
                            placeholder={t("placeholders.searchCountry")}
                          />
                        </SearchField>
                      </div>

                      <ListBox
                        items={countries}
                        className="max-h-[inherit] rounded-t-none border-0 bg-transparent shadow-none"
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
                </PopoverContent>
              </Select>
            </div>

            {/* Phone input */}
            <div className="flex flex-1">
              <div className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm">
                {selectedCountry?.callingCode || "+"}
              </div>

              <Input
                value={phone}
                inputMode="numeric"
                onChange={handlePhoneChange}
                placeholder={t("placeholders.phone")}
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>

        {/* Status filter */}
        <div className="space-y-1">
          <div className="text-sm font-medium">{t("status.title")}</div>

          <div className="grid grid-cols-2">
            {STATUS_OPTIONS.map(({ key, i18nKey }) => {
              const selected = statusFilter.values.has(key);

              return (
                <Checkbox
                  key={key}
                  isSelected={selected}
                  onChange={() => statusFilter.toggle(key)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted"
                >
                  {t(`status.${i18nKey}`)}
                </Checkbox>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
