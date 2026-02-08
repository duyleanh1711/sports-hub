import { useFilters } from "./use-filters";

import type { FilterOp } from "@/types/filter";

export function useTextFilter(field: string) {
  const { getFilter, setFilter, removeFilter } = useFilters();

  const filter = getFilter<string>(field);
  const value = filter?.value ?? "";

  const resolvedOp: FilterOp = "==";

  const set = (next: string) => {
    const trimmed = next.trim();

    if (!trimmed) {
      removeFilter(field);
      return;
    }

    setFilter(field, resolvedOp, trimmed);
  };

  const clear = () => {
    removeFilter(field);
  };

  return {
    value,
    set,
    clear,
    isActive: value.length > 0,
  };
}
