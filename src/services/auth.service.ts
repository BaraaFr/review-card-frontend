import {
  api,
} from "@/lib/api";

import type {
  User,
} from "@/types/auth";

type AuthResponse = {
  success: boolean;
  message: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type ActivateAccountPayload = {
  token: string;
  password: string;
  confirmPassword: string;
};

export const authService = {
  async login(
    payload: LoginPayload
  ) {
    const response =
      await api.post<AuthResponse>(
        "/auth/login",
        payload
      );

    return response.data.user;
  },

  async me() {
    const response =
      await api.get<AuthResponse>(
        "/auth/me"
      );

    return response.data.user;
  },

  async activateAccount(
    payload:
      ActivateAccountPayload
  ) {
    const response =
      await api.post<AuthResponse>(
        "/auth/activate-account",
        payload
      );

    return response.data.user;
  },

  async logout() {
    await api.post(
      "/auth/logout"
    );
  },
};