"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  adminOverviewService,
} from "@/services/overview.service";

export const adminOverviewKeys = {
  all: [
    "admin",
    "overview",
  ] as const,
};

export function useAdminOverview() {
  return useQuery({
    queryKey:
      adminOverviewKeys.all,

    queryFn:
      adminOverviewService.get,

    staleTime:
      30 * 1000,
  });
}