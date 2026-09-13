"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  adminSubscriptionsService,
} from "@/services/admin-subscriptions.service";

export const adminSubscriptionKeys = {
  all: [
    "admin",
    "subscriptions",
  ] as const,
};

export function useAdminSubscriptions() {
  return useQuery({
    queryKey:
      adminSubscriptionKeys.all,

    queryFn:
      adminSubscriptionsService
        .getAll,
  });
}