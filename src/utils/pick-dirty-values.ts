export const pickDirtyValues = <T extends Record<string, any>>(
  values: T,
  dirty: Partial<Record<keyof T, boolean>>,
) =>
  Object.fromEntries(
    Object.keys(dirty).map((key) => [key, values[key as keyof T]]),
  ) as Partial<T>;
