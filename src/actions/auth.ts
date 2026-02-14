"use server";

import { cookies } from "next/headers";

import axios from "axios";

import { apiClient } from "@/lib/axios/api-client";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export async function login(payload: LoginPayload) {
  try {
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("LOGIN ERROR:", error.response?.data);

      throw new Error(error.response?.data?.code);
    }

    throw error;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
}
