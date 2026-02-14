"use server";

import { cookies } from "next/headers";

import { safeApi } from "@/lib/api/safe-api";
import { apiClient } from "@/lib/api/api-client";

import type { LoginPayload, LoginResponse } from "@/types/auth";

export async function login(payload: LoginPayload) {
  return safeApi(async () => {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login/user",
      payload,
    );

    const {
      user,
      token: { access_token },
    } = data.data;

    const cookieStore = await cookies();

    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return user;
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
}
