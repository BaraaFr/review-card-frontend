"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  operationsService,
} from "@/services/operations.service";

export const operationalHealthKeys = {
  all: [
    "admin",
    "operations",
    "health",
  ] as const,
};

export function useOperationalHealth() {
  return useQuery({
    queryKey:
      operationalHealthKeys.all,

    queryFn:
      operationsService
        .getHealth,

    /*
     * Operational data changes much
     * faster than normal admin data.
     */
    staleTime:
      15 * 1000,

    /*
     * Refresh while the admin keeps
     * the page open.
     */
    refetchInterval:
      30 * 1000,

    refetchOnWindowFocus:
      true,

    retry:
      1,
  });
}