"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  CreateAdditionalBusinessPayload,
  CreateCustomerPayload,
} from "@/types/customer";

import {
  customersService,
} from "@/services/customers.service"

export const customerKeys = {
  all: [
    "admin",
    "customers",
  ] as const,

  list: () =>
    [
      ...customerKeys.all,
      "list",
    ] as const,

  detail: (
    userId: string
  ) =>
    [
      ...customerKeys.all,
      "detail",
      userId,
    ] as const,
};

export function useCustomers() {
  return useQuery({
    queryKey:
      customerKeys.list(),

    queryFn:
      customersService.getAll,
  });
}

export function useCreateCustomer() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload:
        CreateCustomerPayload
    ) =>
      customersService.create(
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          customerKeys.all,
      });
    },
  });
}

export function useResendActivation() {
  return useMutation({
    mutationFn: (
      userId: string
    ) =>
      customersService
        .resendActivation(
          userId
        ),
  });
}

export function useDisableCustomer() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      userId: string
    ) =>
      customersService.disable(
        userId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          customerKeys.all,
      });
    },
  });
}

export function useEnableCustomer() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      userId: string
    ) =>
      customersService.enable(
        userId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          customerKeys.all,
      });
    },
  });
}

export function useCustomer(
  userId:
    | string
    | null
) {
  return useQuery({
    queryKey:
      customerKeys.detail(
        userId ??
          "none"
      ),

    queryFn: () =>
      customersService.getById(
        userId!
      ),

    enabled:
      Boolean(userId),
  });
}

export function useCreateAdditionalBusiness() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;

      payload:
        CreateAdditionalBusinessPayload;
    }) =>
      customersService
        .createAdditionalBusiness(
          userId,
          payload
        ),

    onSuccess: async (
      _result,
      variables
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            customerKeys.detail(
              variables.userId
            ),
        }),

        queryClient.invalidateQueries({
          queryKey:
            customerKeys.list(),
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "subscriptions",
          ],
        }),
      ]);
    },
  });
}