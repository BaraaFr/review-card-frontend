"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  authService,
} from "@/services/auth.service";

export const authKeys = {
  all: ["auth"] as const,

  me: () =>
    [...authKeys.all, "me"] as const,
};

export function useMe() {
  return useQuery({
    queryKey:
      authKeys.me(),

    queryFn:
      authService.me,

    retry: false,

    staleTime:
      5 * 60 * 1000,
  });
}
