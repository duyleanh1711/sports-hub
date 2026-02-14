"use client";

import type { ReactNode } from "react";

import { SearchInput } from "@/components/ui/search-field";
import { CardTitle, CardDescription, CardAction } from "@/components/ui/card";

export type DataTableToolbarProps = {
  title: string;
  description: string;
  searchValue: string;
  actions?: ReactNode;
  searchPlaceholder: string;
  onSearchChange?: (value: string) => void;
};

export function DataTableToolbar({
  title,
  actions,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: DataTableToolbarProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="hidden sm:block w-[60%]">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>

      {(onSearchChange || actions) && (
        <CardAction className="w-full flex items-center justify-end gap-2">
          {onSearchChange && (
            <SearchInput
              className="min-w-full sm:min-w-sm"
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          )}

          {actions}
        </CardAction>
      )}
    </div>
  );
}
