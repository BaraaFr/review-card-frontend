"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  businessesService,
  type CreateBusinessPayload,
  type UpdateBusinessPayload,
} from "@/services/business.service";

export const businessKeys = {
  all: [
    "businesses",
  ] as const,

  list: () =>
    [
      ...businessKeys.all,
      "list",
    ] as const,
};

export function useBusinesses() {
  return useQuery({
    queryKey:
      businessKeys.list(),

    queryFn:
      businessesService.getAll,
  });
}

export function useCreateBusiness() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateBusinessPayload
    ) =>
      businessesService.create(
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          businessKeys.all,
      });
    },
  });
}

export function useUpdateBusiness() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      payload,
    }: {
      businessId: string;

      payload:
        UpdateBusinessPayload;
    }) =>
      businessesService.update(
        businessId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          businessKeys.all,
      });
    },
  });
}