"use server";

import { cookies } from "next/headers";

import { apiServer } from "@/lib/axios/api-server";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export async function loginAction(payload: LoginPayload) {
  const { data } = await apiServer.post<LoginResponse>(
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
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
}
