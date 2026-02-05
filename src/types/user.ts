export type UserStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "banned"
  | "pending";

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
