import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {
      home: (await import(`./messages/${locale}/home.json`)).default,
      auth: (await import(`./messages/${locale}/auth.json`)).default,
      user: (await import(`./messages/${locale}/user.json`)).default,
      admin: (await import(`./messages/${locale}/admin.json`)).default,
      theme: (await import(`./messages/${locale}/theme.json`)).default,
      language: (await import(`./messages/${locale}/language.json`)).default,
    },
  };
});
