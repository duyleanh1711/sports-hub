import { useFilters } from "./use-filters";

export function useMultiSelectFilter(field: string) {
  const { getFilter, setFilter, removeFilter } = useFilters();

  const filter = getFilter<string[]>(field);
  const values = new Set(filter?.value ?? []);

  const toggle = (value: string) => {
    const next = new Set(values);

    next.has(value) ? next.delete(value) : next.add(value);

    if (next.size === 0) {
      removeFilter(field);
      return;
    }

    setFilter(field, "in", Array.from(next));
  };

  const clear = () => {
    removeFilter(field);
  };

  return {
    values,
    toggle,
    clear,
    isActive: values.size > 0,
    count: values.size,
  };
}
