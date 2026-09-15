"use client";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  authService,
} from "@/services/auth.service";

import type {
  ForgotPasswordPayload,
} from "@/services/auth.service";

export function useForgotPassword() {
  return useMutation({
    mutationFn:
      (
        payload:
          ForgotPasswordPayload
      ) =>
        authService
          .forgotPassword(
            payload
          ),
  });
}