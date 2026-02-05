"use server";

import { apiServer } from "@/lib/axios/api-server";

import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/shared";

export async function getMe() {
  const { data } = await apiServer.get<ApiResponse<User>>("/users/me", {
    withCredentials: true,
  });

  return data;
}
