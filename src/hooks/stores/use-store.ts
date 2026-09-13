"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  storesService,
  type CreateStorePayload,
  type UpdateStorePayload,
} from "@/services/store.service";

import {
  businessKeys,
} from "@/hooks/business/use-businesses";

import type {
  Store,
} from "@/types/business";

import type {
  CustomerDetail,
} from "@/types/customer";

import type {
  AdminSubscriptionRecord,
} from "@/types/admin-subscription";

import type {
  SubscriptionUsageResult,
} from "@/types/subscription";

import {
  subscriptionKeys,
} from "@/hooks/subscriptions/use-subscription";

export const storeKeys = {
  all: [
    "stores",
  ] as const,

  byBusiness: (
    businessId: string
  ) =>
    [
      ...storeKeys.all,
      "business",
      businessId,
    ] as const,

  detail: (
    storeId: string
  ) =>
    [
      ...storeKeys.all,
      "detail",
      storeId,
    ] as const,
};

export function useStores(
  businessId:
    | string
    | null
) {
  return useQuery({
    queryKey:
      storeKeys.byBusiness(
        businessId ??
          "none"
      ),

    queryFn: () =>
      storesService.getByBusiness(
        businessId!
      ),

    enabled:
      Boolean(
        businessId
      ),
  });
}

export function useCreateStore() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      payload,
    }: {
      businessId: string;

      payload:
        CreateStorePayload;
    }) =>
      storesService.create(
        businessId,
        payload
      ),

    onSuccess: (
      newStore,
      variables
    ) => {
      const {
        businessId,
      } = variables;

      /*
       * 1. Add location immediately
       * to the business locations
       * cache.
       */
      queryClient.setQueryData(
        storeKeys.byBusiness(
          businessId
        ),
        (
          old:
            | Store[]
            | undefined
        ) => {
          if (!old) {
            return [
              newStore,
            ];
          }

          return [
            newStore,
            ...old,
          ];
        }
      );

      /*
       * 2. Update subscription usage
       * immediately:
       *
       * Locations 1 / 3
       * becomes
       * Locations 2 / 3
       */
      queryClient.setQueryData(
        subscriptionKeys.usage(
          businessId
        ),
        (
          old:
            | SubscriptionUsageResult
            | undefined
        ) => {
          if (!old) {
            return old;
          }

          return {
            ...old,

            usage: {
              ...old.usage,

              stores:
                old.usage.stores +
                1,
            },

            remaining: {
              ...old.remaining,

              stores:
                Math.max(
                  0,
                  old.remaining
                    .stores -
                    1
                ),
            },
          };
        }
      );

      /*
       * 3. Update global admin
       * subscriptions table
       * location count.
       */
      queryClient.setQueryData(
        [
          "admin",
          "subscriptions",
        ],
        (
          old:
            | AdminSubscriptionRecord[]
            | undefined
        ) => {
          if (!old) {
            return old;
          }

          return old.map(
            (record) =>
              record.business
                .id ===
              businessId
                ? {
                    ...record,

                    locationsCount:
                      record
                        .locationsCount +
                      1,
                  }
                : record
          );
        }
      );

      /*
       * 4. Update the Admin Customer
       * Detail cache.
       *
       * This makes the business's
       * own stores array/count update
       * immediately too.
       */
      queryClient.setQueriesData(
        {
          queryKey: [
            "admin",
            "customers",
            "detail",
          ],
        },
        (
          old:
            | CustomerDetail
            | undefined
        ) => {
          if (!old) {
            return old;
          }

          return {
            ...old,

            businesses:
              old.businesses.map(
                (
                  business
                ) => {
                  if (
                    business.id !==
                    businessId
                  ) {
                    return business;
                  }

                  return {
                    ...business,

                    stores: [
                      ...(business.stores ??
                        []),

                      newStore,
                    ],

                    _count: {
                      ...business._count,

                      stores:
                        (
                          business
                            ._count
                            ?.stores ??
                          business
                            .stores
                            ?.length ??
                          0
                        ) + 1,
                    },
                  };
                }
              ),
          };
        }
      );

      /*
       * 5. Background reconciliation
       * with backend.
       */
      queryClient.invalidateQueries({
        queryKey:
          storeKeys.byBusiness(
            businessId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          subscriptionKeys.usage(
            businessId
          ),
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "customers",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "subscriptions",
        ],
      });
    },
  });
}

export function useUpdateStore() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      payload,
    }: {
      storeId: string;

      payload:
        UpdateStorePayload;
    }) =>
      storesService.update(
        storeId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          storeKeys.all,
      });
    },
  });
}

export function useDeleteStore() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      storeId: string
    ) =>
      storesService.remove(
        storeId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          storeKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey:
          businessKeys.all,
      });
    },
  });
}