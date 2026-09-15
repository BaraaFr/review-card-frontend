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

export function useLogout() {
  const router = useRouter();

  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: async () => {
      queryClient.clear();
      localStorage.clear()

      window.Tawk_API?.logout?.(
        (
          error
        ) => {
          if (error) {
            console.error(
              "Unable to logout Tawk visitor",
              error
            );

            return;
          }

          window.__VALYOU_TAWK_USER_ID =
            undefined;

          window.__VALYOU_TAWK_LOGIN_PENDING_USER_ID =
            undefined;
        }
      );

      router.replace(
        "/"
      );
    },
  });
}