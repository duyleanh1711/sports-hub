"use client";

import {
  parseAsJson,
  useQueryState,
  parseAsString,
  parseAsInteger,
} from "nuqs";

import { filtersSchema } from "@/types/filter";

export function useAccountParams() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const [filters] = useQueryState(
    "filters",
    parseAsJson(filtersSchema).withDefault([]),
  );

  const updateSearch = (value: string) => {
    setPage(1);
    setSearch(value || null);
  };

  const resetPage = () => setPage(1);

  return {
    page,
    limit,
    search,
    filters,
    setPage,
    resetPage,
    updateSearch,
  };
}
