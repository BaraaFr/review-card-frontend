import {
  api,
  publicApi,
} from "@/lib/api";

import type {
  User,
} from "@/types/auth";

/*
 * =========================================================
 * Responses
 * =========================================================
 */

type AuthResponse = {
  success:
    boolean;

  message?:
    string;

  user:
    User;
};

type MessageResponse = {
  success:
    boolean;

  message:
    string;

  code?:
    string;
};

/*
 * =========================================================
 * Payloads
 * =========================================================
 */

export type LoginPayload = {
  email:
    string;

  password:
    string;
};

export type RegisterPayload = {
  name:
    string;

  email:
    string;

  password:
    string;
};

export type ActivateAccountPayload = {
  token:
    string;

  password:
    string;

  confirmPassword:
    string;
};

export type ForgotPasswordPayload = {
  email:
    string;
};

export type ResetPasswordPayload = {
  token:
    string;

  password:
    string;

  confirmPassword:
    string;
};

/*
 * =========================================================
 * Service
 * =========================================================
 */

export const authService = {
  async login(
    payload:
      LoginPayload
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

  async forgotPassword(
    payload:
      ForgotPasswordPayload
  ) {
    const response =
      await publicApi.post<MessageResponse>(
        "/auth/forgot-password",
        payload
      );

    return response.data;
  },

  async resetPassword(
    payload:
      ResetPasswordPayload
  ) {
    const response =
      await publicApi.post<MessageResponse>(
        "/auth/reset-password",
        payload
      );

    return response.data;
  },

  async logout() {
    await api.post(
      "/auth/logout"
    );
  },
};