"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useRouter,
} from "next/navigation";

import {
  authService,
} from "@/services/auth.service";

import {
  authKeys,
} from "./use-me";

import type {
  LoginPayload,
} from "@/services/auth.service";

export function useLogin() {
  const router = useRouter();

  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: LoginPayload
    ) =>
      authService.login(
        payload
      ),

    onSuccess: (user) => {
      queryClient.setQueryData(
        authKeys.me(),
        user
      );

      if (
        user.role ===
        "SUPER_ADMIN"
      ) {
        router.replace(
          "/admin/dashboard"
        );

        return;
      }

      router.replace(
        "/dashboard"
      );
    },
  });
}