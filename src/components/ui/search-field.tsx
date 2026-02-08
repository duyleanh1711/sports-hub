"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import type { InputProps, SearchFieldProps } from "react-aria-components";
import { SearchField as SearchFieldPrimitive } from "react-aria-components";
import { fieldStyles } from "@/components/ui/field";
import { cx } from "@/lib/primitive";
import { Input, InputGroup } from "./input";

export function SearchField({ className, ...props }: SearchFieldProps) {
  return (
    <SearchFieldPrimitive
      data-slot="control"
      {...props}
      aria-label={props["aria-label"] ?? "Search"}
      className={cx(
        fieldStyles({ className: "group/search-field" }),
        className,
      )}
    />
  );
}

export function SearchInput(props: InputProps) {
  return (
    <InputGroup className="[--input-gutter-end:--spacing(8)]">
      <MagnifyingGlassIcon className="in-disabled:opacity-50" />
      <Input {...props} />
    </InputGroup>
  );
}
