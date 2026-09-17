"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  subscriptionsService,
  type CreateSubscriptionPayload,
  type UpdateSubscriptionPayload,
} from "@/services/subscriptions.service";
import { SubscriptionPlan } from "@/types/subscription";

export const subscriptionKeys = {
  all: [
    "subscriptions",
  ] as const,

  usage: (
    businessId: string
  ) =>
    [
      ...subscriptionKeys.all,
      "usage",
      businessId,
    ] as const,
  current: (
    businessId: string
  ) =>
    [
      ...subscriptionKeys.all,
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
      subscriptionKeys.usage(
        businessId ??
        "none"
      ),



    queryFn: () =>
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
export function useCreateSubscription() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      payload,
    }: {
      businessId: string;

      payload:
        CreateSubscriptionPayload;
    }) =>
      subscriptionsService.create(
        businessId,
        payload
      ),

    onSuccess: (
      newSubscription,
      variables
    ) => {
      /*
       * Update business usage
       * immediately.
       */
      queryClient.setQueryData(
        subscriptionKeys.usage(
          variables.businessId
        ),
        (
          old:
            | any
            | undefined
        ) => {
          if (!old) {
            return old;
          }

          return {
            ...old,

            subscription:
              newSubscription,
          };
        }
      );

      /*
       * Update global admin table.
       */
      queryClient.setQueryData(
        [
          "admin",
          "subscriptions",
        ],
        (
          old:
            | any[]
            | undefined
        ) => {
          if (!old) {
            return old;
          }

          return old.map(
            (record) =>
              record.business.id ===
              variables.businessId
                ? {
                    ...record,

                    subscription:
                      newSubscription,
                  }
                : record
          );
        }
      );

      /*
       * Background sync.
       */
      queryClient.invalidateQueries({
        queryKey:
          subscriptionKeys.usage(
            variables.businessId
          ),
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "subscriptions",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "customers",
        ],
      });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      subscriptionId,
      businessId,
      payload,
    }: {
      subscriptionId: string;

      businessId: string;

      payload:
        UpdateSubscriptionPayload;
    }) =>
      subscriptionsService.update(
        subscriptionId,
        payload
      ),

    onSuccess: (
      updatedSubscription,
      variables
    ) => {
      /*
       * 1. Update subscription usage
       * cache immediately.
       */
      queryClient.setQueryData(
        subscriptionKeys.usage(
          variables.businessId
        ),
        (
          old:
            | any
            | undefined
        ) => {
          if (!old) {
            return old;
          }

          return {
            ...old,

            subscription: {
              ...old.subscription,

              ...updatedSubscription,
            },
          };
        }
      );

      /*
       * 2. Update global admin
       * subscriptions table
       * immediately.
       */
      queryClient.setQueryData(
        [
          "admin",
          "subscriptions",
        ],
        (
          old:
            | any[]
            | undefined
        ) => {
          if (!old) {
            return old;
          }

          return old.map(
            (record) =>
              record.business.id ===
              variables.businessId
                ? {
                    ...record,

                    subscription:
                      updatedSubscription,
                  }
                : record
          );
        }
      );

      /*
       * 3. Silently verify with
       * backend afterwards.
       */
      queryClient.invalidateQueries({
        queryKey:
          subscriptionKeys.usage(
            variables.businessId
          ),
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "subscriptions",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "customers",
        ],
      });
    },
  });
}

export function useStartTrial() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      businessId: string
    ) =>
      subscriptionsService
        .startTrial(
          businessId
        ),

    onSuccess:
      async (
        _subscription,
        businessId
      ) => {
        await Promise.all([
          queryClient
            .invalidateQueries({
              queryKey:
                subscriptionKeys
                  .usage(
                    businessId
                  ),
            }),

          queryClient
            .invalidateQueries({
              queryKey: [
                "admin",
                "subscriptions",
              ],
            }),

          queryClient
            .invalidateQueries({
              queryKey: [
                "admin",
                "customers",
              ],
            }),
        ]);
      },
  });
}

export function useActivatePaidSubscription() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      plan,
      months,
    }: {
      businessId: string;

      plan:
        SubscriptionPlan;

      months: number;
    }) =>
      subscriptionsService
        .activatePaid(
          businessId,
          {
            plan,
            months,
          }
        ),

    onSuccess:
      async (
        _subscription,
        variables
      ) => {
        await Promise.all([
          queryClient
            .invalidateQueries({
              queryKey:
                subscriptionKeys
                  .usage(
                    variables
                      .businessId
                  ),
            }),

          queryClient
            .invalidateQueries({
              queryKey: [
                "admin",
                "subscriptions",
              ],
            }),

          queryClient
            .invalidateQueries({
              queryKey: [
                "admin",
                "customers",
              ],
            }),
        ]);
      },
  });
}