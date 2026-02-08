import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { GetUsersParams } from "@/types/user";
import { QUERY_KEYS } from "@/react-query/query-keys";
import { getMe, getUserById, getUsers } from "@/actions/user";

export function useMe() {
  return useQuery({
    queryKey: QUERY_KEYS.user.me,
    queryFn: getMe,
    retry: false,
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.user.detail(userId),
    queryFn: () => getUserById(userId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: QUERY_KEYS.user.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
