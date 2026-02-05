import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/actions/user";
import { QUERY_KEYS } from "@/react-query/query-keys";

export function useMe() {
  return useQuery({
    queryKey: QUERY_KEYS.user.me,
    queryFn: getMe,
    retry: false,
  });
}
