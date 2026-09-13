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
  type ActivateAccountPayload,
} from "@/services/auth.service";

export function useActivateAccount() {
  const router =
    useRouter();

  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload:
        ActivateAccountPayload
    ) =>
      authService.activateAccount(
        payload
      ),

    onSuccess: (user) => {
      queryClient.setQueryData(
        ["auth", "me"],
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