import type { User } from "./user";
import type { ApiResponse } from "./shared";

export type Token = {
  access_token: string;
  token_type: string;
  expires_at: string;
};

export type LoginData = {
  user: User;
  token: Token;
};

export type LoginResponse = ApiResponse<LoginData>;

export type LoginPayload = {
  email: string;
  password: string;
  captcha_token: string;
};
