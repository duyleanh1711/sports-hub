"use server";

import { safeApi } from "@/lib/api/safe-api";
import { apiServer } from "@/lib/api/api-server";

import type {
  User,
  GetUsersParams,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateMyPhonePayload,
  UpdateMyEmailPayload,
  UpdateMyPasswordPayload,
} from "@/types/user";
import type { ApiResponse, PaginatedResult } from "@/types/shared";

export async function getMe() {
  return safeApi(async () => {
    const { data } = await apiServer.get<ApiResponse<User>>("/users/me");
    return data;
  });
}

export async function getUserById(userId: string) {
  return safeApi(async () => {
    const { data } = await apiServer.get<ApiResponse<User>>(`/users/${userId}`);
    return data;
  });
}

export async function getUsers(params?: GetUsersParams) {
  return safeApi(async () => {
    const cleanParams = Object.fromEntries(
      Object.entries({
        sort_by: "created_at",
        order_by: "desc",
        page: 1,
        limit: 10,
        ...params,
        filters:
          // biome-ignore lint/complexity/useOptionalChain: <explanation>
          params?.filters && params.filters.length
            ? JSON.stringify(params.filters)
            : undefined,
      }).filter(([_, v]) => v !== null && v !== undefined),
    );

    const { data } = await apiServer.get<ApiResponse<PaginatedResult<User>>>(
      "/users",
      { params: cleanParams },
    );

    return data;
  });
}

export async function createUser(payload: CreateUserPayload) {
  return safeApi(async () => {
    const { data } = await apiServer.post<ApiResponse<User>>("/users", payload);
    return data;
  });
}

export async function updateMe(payload: UpdateUserPayload) {
  return safeApi(async () => {
    const { data } = await apiServer.patch<ApiResponse<User>>(
      "/users/me",
      payload,
    );
    return data;
  });
}

export async function updateUser(userId: string, payload: UpdateUserPayload) {
  return safeApi(async () => {
    const { data } = await apiServer.patch<ApiResponse<User>>(
      `/users/${userId}`,
      payload,
    );
    return data;
  });
}

export async function updateUserStatus(userId: string, status: string) {
  return safeApi(async () => {
    const { data } = await apiServer.post<ApiResponse<User>>(
      `/users/${userId}/status/${status}`,
    );
    return data;
  });
}

export async function updateMyEmail(payload: UpdateMyEmailPayload) {
  return safeApi(async () => {
    const { data } = await apiServer.put<ApiResponse<User>>(
      "/users/me/email",
      payload,
    );
    return data;
  });
}

export async function updateMyPhone(payload: UpdateMyPhonePayload) {
  return safeApi(async () => {
    const { data } = await apiServer.put<ApiResponse<User>>(
      "/users/me/phone",
      payload,
    );
    return data;
  });
}

export async function updateMyPassword(payload: UpdateMyPasswordPayload) {
  return safeApi(async () => {
    const { data } = await apiServer.put<ApiResponse<null>>(
      "/users/me/password",
      payload,
    );
    return data;
  });
}

export async function promoteUser(userId: string) {
  return safeApi(async () => {
    const { data } = await apiServer.post<ApiResponse<User>>(
      `/users/${userId}/promote`,
    );
    return data;
  });
}

export async function demoteUser(userId: string) {
  return safeApi(async () => {
    const { data } = await apiServer.post<ApiResponse<User>>(
      `/users/${userId}/demote`,
    );
    return data;
  });
}

export async function deleteUser(userId: string) {
  return safeApi(async () => {
    const { data } = await apiServer.delete<ApiResponse<null>>(
      `/users/${userId}`,
    );
    return data;
  });
}

export async function bulkDeleteUsers(userIds: string[]) {
  return safeApi(async () => {
    const { data } = await apiServer.post<ApiResponse<null>>(
      "/users/bulk-delete",
      { user_ids: userIds },
    );
    return data;
  });
}
