"use server";

import { AxiosError } from "axios";

import { apiServer } from "@/lib/axios/api-server";

import type {
  User,
  GetUsersParams,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user";
import type { ApiResponse, PaginatedResult } from "@/types/shared";

export async function getMe() {
  const { data } = await apiServer.get<ApiResponse<User>>("/users/me");
  return data;
}

export async function getUserById(userId: string) {
  const { data } = await apiServer.get<ApiResponse<User>>(`/users/${userId}`);
  return data;
}

export async function getUsers(params?: GetUsersParams) {
  const cleanParams = Object.fromEntries(
    Object.entries({
      sort_by: "created_at",
      order_by: "desc",
      page: 1,
      limit: 10,
      ...params,
      filters:
        params?.filters && params.filters.length
          ? JSON.stringify(params.filters)
          : undefined,
    }).filter(([_, v]) => v !== null && v !== undefined),
  );

  const { data } = await apiServer.get<ApiResponse<PaginatedResult<User>>>(
    "/users",
    {
      params: cleanParams,
    },
  );

  return data;
}

export async function createUser(payload: CreateUserPayload) {
  try {
    const { data } = await apiServer.post("/users", payload);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }),
      );
    }

    throw new Error("Unknown error");
  }
}

export async function updateUser(userId: string, payload: UpdateUserPayload) {
  try {
    const { data } = await apiServer.patch<ApiResponse<User>>(
      `/users/${userId}`,
      payload,
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }),
      );
    }

    throw new Error("Unknown error");
  }
}

export async function updateUserStatus(userId: string, status: string) {
  try {
    const { data } = await apiServer.post<ApiResponse<User>>(
      `/users/${userId}/status/${status}`,
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }),
      );
    }

    throw new Error("Unknown error");
  }
}

export async function promoteUser(userId: string) {
  try {
    const { data } = await apiServer.post<ApiResponse<User>>(
      `/users/${userId}/promote`,
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }),
      );
    }

    throw new Error("Unknown error");
  }
}

export async function demoteUser(userId: string) {
  try {
    const { data } = await apiServer.post<ApiResponse<User>>(
      `/users/${userId}/demote`,
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }),
      );
    }

    throw new Error("Unknown error");
  }
}

export async function deleteUser(userId: string) {
  try {
    const { data } = await apiServer.delete<ApiResponse<null>>(
      `/users/${userId}`,
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }),
      );
    }

    throw new Error("Unknown error");
  }
}

export async function bulkDeleteUsers(userIds: string[]) {
  try {
    const { data } = await apiServer.post<ApiResponse<null>>(
      "/users/bulk-delete",
      {
        user_ids: userIds,
      },
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }),
      );
    }

    throw new Error("Unknown error");
  }
}
