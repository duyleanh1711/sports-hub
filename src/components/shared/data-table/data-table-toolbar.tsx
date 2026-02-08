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
    <>
      <CardTitle>{title}</CardTitle>

      {description && <CardDescription>{description}</CardDescription>}

      {(onSearchChange || actions) && (
        <CardAction className="flex items-center gap-2">
          {onSearchChange && (
            <SearchInput
              className="min-w-sm"
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          )}

          {actions}
        </CardAction>
      )}
    </>
  );
}
