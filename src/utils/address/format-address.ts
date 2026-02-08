import type { User } from "@/types/user";

export function formatAddress(user: User) {
  return [user.address, user.ward, user.province].filter(Boolean).join(", ");
}
