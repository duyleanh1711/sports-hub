import type { Filter } from "./filter";

export type UserStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "banned"
  | "pending";

export type UserLocale = "vi-VN" | "en-US";

export type User = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  is_superuser: boolean;
  phone_verified_at: string | null;
  email_verified_at: string | null;
  status: UserStatus;
  country_code: string;
  province: string;
  ward: string;
  address: string;
  locale: string;
  avatar_url: string;
  created_at: string;
};

export type GetUsersParams = {
  search?: string | null;
  search_in?: string | null;
  filters?: Filter[];
  sort_by?: string | null;
  order_by?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type CreateUserPayload = {
  fullname: string;
  password: string;
  status: UserStatus;
  email?: string | null;
  phone?: string | null;
  is_superuser?: boolean;
  country_code?: string | null;
  province?: string | null;
  ward?: string | null;
  address?: string | null;
  locale: UserLocale;
};

export type UpdateUserPayload = Partial<{
  fullname: string;
  country_code: string | null;
  province: string | null;
  ward: string | null;
  address: string | null;
  locale: "vi-VN" | "en-US";
}>;
