export const findCodeByName = <T extends { code: number; name: string }>(
  list: T[],
  name?: string | null,
) => {
  if (!name) return null;
  const item = list.find((i) => i.name === name);
  return item ? String(item.code) : null;
};
