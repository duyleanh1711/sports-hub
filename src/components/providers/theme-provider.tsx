"use client";

import { useRouter } from "next/navigation";

import {
  useTheme,
  type ThemeProviderProps,
  ThemeProvider as NextThemesProvider,
} from "next-themes";
import { RouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <NextThemesProvider
        enableSystem
        storageKey="intentui-theme"
        attribute="class"
        {...props}
      >
        {children}
      </NextThemesProvider>
    </RouterProvider>
  );
}

export default ThemeProvider;
export { useTheme };
