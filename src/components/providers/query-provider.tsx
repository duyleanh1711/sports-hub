"use client";

import { ReactNode, useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => queryClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
