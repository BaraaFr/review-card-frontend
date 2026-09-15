"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  authService,
} from "@/services/auth.service";

import type {
  ResetPasswordPayload,
} from "@/services/auth.service";

import {
  authKeys,
} from "./use-me";

export function useResetPassword() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      (
        payload:
          ResetPasswordPayload
      ) =>
        authService
          .resetPassword(
            payload
          ),

    onSuccess:
      () => {
        /*
         * If this browser previously had an
         * authenticated user cached, don't let
         * GuestGuard treat that stale identity
         * as still logged in.
         */

        queryClient.removeQueries({
          queryKey:
            authKeys.all,
        });
      },
  });
}