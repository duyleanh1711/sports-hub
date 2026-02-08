import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  UserStatus,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user";
import {
  createUser,
  deleteUser,
  demoteUser,
  updateUser,
  promoteUser,
  bulkDeleteUsers,
  updateUserStatus,
} from "@/actions/user";

export function useCreateUser(
  tToast: (key: string) => string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),

    onSuccess: () => {
      toast.success(tToast("toast.success"));
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
      onSuccess?.();
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || tToast("toast.error"));
    },
  });
}

export function useUpdateUser(
  tToast: (key: string) => string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUserPayload;
    }) => updateUser(userId, payload),

    onSuccess: () => {
      toast.success(tToast("toast.success"));
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
      onSuccess?.();
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || tToast("toast.error"));
    },
  });
}

export function useUpdateUserStatus(tToast: (key: string) => string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      updateUserStatus(userId, status),

    onSuccess: () => {
      toast.success(tToast("toast.success"));
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || tToast("toast.error"));
    },
  });
}

function useUserRoleMutation(
  mutationFn: (userId: string) => Promise<any>,
  tToast: (key: string) => string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: () => {
      toast.success(tToast("toast.success"));
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || tToast("toast.error"));
    },
  });
}

export function usePromoteUser(tToast: (key: string) => string) {
  return useUserRoleMutation(promoteUser, tToast);
}

export function useDemoteUser(tToast: (key: string) => string) {
  return useUserRoleMutation(demoteUser, tToast);
}

export function useDeleteUser(
  tToast: (key: string) => string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),

    onSuccess: () => {
      toast.success(tToast("toast.success"));
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
      onSuccess?.();
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || tToast("toast.error"));
    },
  });
}

export function useBulkDeleteUsers(
  tToast: (key: string) => string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) => bulkDeleteUsers(userIds),

    onSuccess: () => {
      toast.success(tToast("toast.success"));
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
      onSuccess?.();
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || tToast("toast.error"));
    },
  });
}
