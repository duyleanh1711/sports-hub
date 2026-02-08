import { useQuery } from "@tanstack/react-query";

import type { Country, Province, Ward } from "@/types/area";
import { getCountries, getProvinces, getWards } from "@/actions/area";

export const useCountries = () =>
  useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useProvinces = () =>
  useQuery<Province[]>({
    queryKey: ["provinces"],
    queryFn: getProvinces,
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useWards = (province?: number) =>
  useQuery<Ward[]>({
    queryKey: ["wards", province],
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    queryFn: () => getWards(province!),
    enabled: !!province,
  });
