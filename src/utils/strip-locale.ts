export function stripLocale(path: string) {
  return path.replace(/^\/(en|vi)(?=\/)/, "");
}
