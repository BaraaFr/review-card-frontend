"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  adminRenewalsService,
  type UpdateRenewalPayload,
} from "@/services/admin-renewals.service";

import {
  adminSubscriptionKeys,
} from "./use-admin-subscriptions";

export function useUpdateRenewalFollowUp() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      subscriptionId,
      payload,
    }: {
      subscriptionId:
        string;

      payload:
        UpdateRenewalPayload;
    }) =>
      adminRenewalsService.update(
        subscriptionId,

        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          adminSubscriptionKeys.all,
      });
    },
  });
}