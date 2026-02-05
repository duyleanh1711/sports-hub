"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth";
import { useMe } from "@/react-query/query/user";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setPending } = useAuthStore();
  const { data, isSuccess, isError, isLoading } = useMe();

  useEffect(() => {
    if (isLoading) {
      setPending(true);
      return;
    }

    if (isSuccess && data?.success && data.data) {
      setUser(data.data);
      setPending(false);
      return;
    }

    if (isError || (isSuccess && data && !data.success)) {
      setUser(null);
      setPending(false);
    }
  }, [data, isSuccess, isError, isLoading, setUser, setPending]);

  return <>{children}</>;
}
