"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cardsService,
  type AssignCardPayload,
  type CardFilters,
  type CreateCardPayload,
} from "@/services/cards.service";

import {
  storeKeys,
} from "@/hooks/stores/use-store";

import {
  analyticsKeys,
} from "@/hooks/analytics/use-analytics";
import { CardPaymentMethod } from "@/types/card";

export const cardKeys = {
  all: [
    "cards",
  ] as const,

  list: (
    filters: CardFilters
  ) =>
    [
      ...cardKeys.all,
      "list",
      filters,
    ] as const,
};

export function useCards(
  filters: CardFilters,
  enabled = true
) {
  return useQuery({
    queryKey:
      cardKeys.list(
        filters
      ),

    queryFn: () =>
      cardsService.getAll(
        filters
      ),

    enabled,
  });
}

export function useCreateCard() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload:
        CreateCardPayload
    ) =>
      cardsService.create(
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          cardKeys.all,
      });
    },
  });
}

export function useUpdateCard() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      label,
    }: {
      cardId: string;

      label:
        | string
        | null;
    }) =>
      cardsService.update(
        cardId,
        {
          label,
        }
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          cardKeys.all,
      });
    },
  });
}

export function useAssignCard() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      payload,
    }: {
      cardId: string;

      payload:
        AssignCardPayload;
    }) =>
      cardsService.assign(
        cardId,
        payload
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            cardKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey:
            storeKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey:
            analyticsKeys.all,
        }),
      ]);
    },
  });
}

export function useUnassignCard() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      cardId: string
    ) =>
      cardsService.unassign(
        cardId
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            cardKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey:
            storeKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey:
            analyticsKeys.all,
        }),
      ]);
    },
  });
}

export function useDeliverCard() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      paymentMethod,
    }: {
      cardId: string;

      paymentMethod:
        CardPaymentMethod;
    }) =>
      cardsService.deliver(
        cardId,
        paymentMethod
      ),

    onSuccess:
      async () => {
        await queryClient
          .invalidateQueries({
            queryKey:
              cardKeys.all,
          });
      },
  });
}