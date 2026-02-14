"use server";

import { safeApi } from "@/lib/api/safe-api";
import { apiClient } from "@/lib/api/api-client";

import type { Country, Province, RestCountry, Ward } from "@/types/area";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const PROVINCES_API = process.env.NEXT_PUBLIC_PROVINCES_API_BASE_URL!;

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const RESTCOUNTRIES_API = process.env.NEXT_PUBLIC_RESTCOUNTRIES_API_BASE_URL!;

export async function getProvinces(): Promise<Province[]> {
  return safeApi(async () => {
    const { data } = await apiClient.get<Province[]>(`${PROVINCES_API}/p`);
    return data;
  });
}

export async function getWards(provinceCode: number): Promise<Ward[]> {
  return safeApi(async () => {
    const { data } = await apiClient.get<{ wards?: Ward[] }>(
      `${PROVINCES_API}/p/${provinceCode}?depth=2`,
    );

    return data?.wards ?? [];
  });
}

export async function getCountries(): Promise<Country[]> {
  return safeApi(async () => {
    const { data } = await apiClient.get<RestCountry[]>(
      `${RESTCOUNTRIES_API}/all?fields=cca2,name,flags,idd`,
    );

    return data
      .map((c) => {
        const root = c.idd?.root ?? "";
        const suffix = c.idd?.suffixes?.[0] ?? "";

        return {
          code: c.cca2,
          name: c.name.common,
          flag: c.flags.png || c.flags.svg || "",
          callingCode: root + suffix,
        };
      })
      .filter((c) => c.code && c.name && c.flag && c.callingCode)
      .sort((a, b) => a.name.localeCompare(b.name));
  });
}
