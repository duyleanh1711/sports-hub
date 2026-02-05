"use client";

import { create } from "zustand";

import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  isPending: boolean;
  isVerifying: boolean;

  setUser: (user: User | null) => void;
  setPending: (value: boolean) => void;

  setVerifying: (value: boolean) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isPending: true,
  isVerifying: false,

  setUser: (user) =>
    set({
      user,
      isPending: false,
    }),

  setPending: (value) =>
    set({
      isPending: value,
    }),

  setVerifying: (value) =>
    set({
      isVerifying: value,
    }),

  resetAuth: () =>
    set({
      user: null,
      isPending: false,
      isVerifying: false,
    }),
}));
