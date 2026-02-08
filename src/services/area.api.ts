import type { Country, Province, RestCountry, Ward } from "@/types/area";

export async function fetchProvinces(): Promise<Province[]> {
  const res = await fetch("https://provinces.open-api.vn/api/v2/p");

  if (!res.ok) throw new Error("Fetch provinces failed");

  return res.json();
}

export async function fetchWards(provinceCode: number): Promise<Ward[]> {
  const res = await fetch(
    `https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`,
  );

  if (!res.ok) throw new Error("Fetch wards failed");

  const data = await res.json();
  return data?.wards ?? [];
}

export async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=cca2,name,flags,idd",
  );

  if (!res.ok) throw new Error("Fetch countries failed");

  const data: RestCountry[] = await res.json();

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
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}
