import { parseAsJson, useQueryState } from "nuqs";

import { filtersSchema } from "@/types/filter";
import type { Filter, FilterOp } from "@/types/filter";

type FilterValueByOp = {
  [Op in FilterOp]: Op extends "in" | "not in"
    ? unknown[]
    : Op extends "between" | "between_exclusive"
      ? [unknown, unknown]
      : Op extends
            | "is null"
            | "is not null"
            | "is empty string"
            | "is not empty string"
        ? undefined
        : unknown;
};

export function useFilters() {
  const [filters, setFilters] = useQueryState<Filter[]>(
    "filters",
    parseAsJson(filtersSchema).withDefault([]),
  );

  const getFilter = <T = unknown>(field: string) =>
    filters.find((f) => f.field === field) as
      | (Filter & { value: T })
      | undefined;

  function setFilter<Op extends FilterOp>(
    field: string,
    op: Op,
    value: FilterValueByOp[Op] | null,
  ) {
    setFilters((prev) => {
      const current = prev ?? [];
      const next = current.filter((f) => f.field !== field);

      if (value !== null && !(Array.isArray(value) && value.length === 0)) {
        next.push({ field, op, value } as Filter);
      }

      return next.length > 0 ? next : null;
    });
  }

  const removeFilter = (field: string) => {
    setFilters((prev) => {
      const next = (prev ?? []).filter((f) => f.field !== field);
      return next.length > 0 ? next : null;
    });
  };

  return {
    filters,
    hasActiveFilters: filters.length > 0,
    getFilter,
    setFilter,
    removeFilter,
  };
}
