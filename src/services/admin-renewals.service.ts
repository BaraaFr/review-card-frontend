import {
    api,
  } from "@/lib/api";
  
  import type {
    RenewalFollowUp,
    RenewalFollowUpStatus,
  } from "@/types/admin-subscription";
  
  export type UpdateRenewalPayload = {
    expiresAt: string;
  
    status:
      RenewalFollowUpStatus;
  
    note:
      string | null;
  
    nextFollowUpAt:
      string | null;
  };
  
  type UpdateRenewalResponse = {
    success:
      boolean;
  
    data: {
      followUp:
        RenewalFollowUp;
    };
  };
  
  export const adminRenewalsService = {
    async update(
      subscriptionId: string,
  
      payload:
        UpdateRenewalPayload
    ) {
      const response =
        await api.put<UpdateRenewalResponse>(
          `/admin/subscriptions/${subscriptionId}/renewal-follow-up`,
  
          payload
        );
  
      return response.data.data.followUp;
    },
  };