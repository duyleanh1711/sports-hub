import type { UserStatus } from "@/types/user";

export const STATUS_BADGE: Record<
  UserStatus,
  "success" | "secondary" | "warning" | "danger" | "info"
> = {
  active: "success",
  inactive: "secondary",
  pending: "info",
  suspended: "warning",
  banned: "danger",
};
