export const QUERY_KEYS = {
  user: {
    me: ["user", "me"] as const,
    list: (params?: unknown) => ["user", "list", params] as const,
    detail: (id: string) => ["user", "detail", id] as const,
  },
};
