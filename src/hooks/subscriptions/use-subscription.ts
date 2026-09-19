"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  subscriptionsService,
} from "@/services/subscriptions.service";

import type {
  SubscriptionPlan,
} from "@/types/subscription";

export const subscriptionKeys = {
  all:
    [
      "subscriptions",
    ] as const,

  usage: (
    businessId:
      string
  ) =>
    [
      "subscriptions",
      "usage",
      businessId,
    ] as const,

  current: (
    businessId:
      string
  ) =>
    [
      "subscriptions",
      "current",
      businessId,
    ] as const,
};

export function useSubscriptionUsage(
  businessId:
    | string
    | null
) {
  return useQuery({
    queryKey:
      subscriptionKeys
        .usage(
          businessId ??
            "none"
        ),

    queryFn:
      () =>
        subscriptionsService
          .getUsage(
            businessId!
          ),

    enabled:
      Boolean(
        businessId
      ),
  });
}

/*
 * All successful subscription
 * mutations affect multiple areas:
 *
 * - usage
 * - admin customer data
 * - admin subscription data
 * - payment history
 */
function useRefreshSubscriptionData() {
  const queryClient =
    useQueryClient();

  return async () => {
    await Promise.all([
      queryClient
        .invalidateQueries({
          queryKey:
            subscriptionKeys
              .all,
        }),

      queryClient
        .invalidateQueries({
          queryKey: [
            "admin",
          ],
        }),

      queryClient
        .invalidateQueries({
          queryKey: [
            "payments",
          ],
        }),
    ]);
  };
}

export function useStartTrial() {
  const refresh =
    useRefreshSubscriptionData();

  return useMutation({
    mutationFn: (
      businessId:
        string
    ) =>
      subscriptionsService
        .startTrial(
          businessId
        ),

    onSuccess:
      refresh,
  });
}

export function useActivatePaidSubscription() {
  const refresh =
    useRefreshSubscriptionData();

  return useMutation({
    mutationFn: ({
      businessId,
      ...payment
    }: {
      businessId:
        string;

      plan:
        SubscriptionPlan;

      months:
        number;

      amountCents:
        number;

      paymentMethod:
        | "CASH"
        | "WHISH"
        | "OTHER";

      receiptReference:
        string;
    }) =>
      subscriptionsService
        .activatePaid(
          businessId,
          payment
        ),

    onSuccess:
      refresh,
  });
}