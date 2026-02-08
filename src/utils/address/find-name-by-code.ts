export const findNameByCode = <T extends { code: number; name: string }>(
  list: T[],
  code?: string | null,
) => {
  if (!code) return null;
  const item = list.find((i) => String(i.code) === code);
  return item?.name ?? null;
};
