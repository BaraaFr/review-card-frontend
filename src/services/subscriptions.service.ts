import {
    api,
  } from "@/lib/api";
  
  import type {
    SubscriptionUsageResult,
  } from "@/types/subscription";
  
  type UsageResponse = {
    success: boolean;
  
    data: SubscriptionUsageResult;
  };
  
  import type {
    SubscriptionPlan,
    SubscriptionStatus,
  } from "@/types/subscription";
  
  export type CreateSubscriptionPayload = {
    plan: SubscriptionPlan;
  
    status: SubscriptionStatus;
  
    startsAt?: string;
  
    expiresAt?:
      | string
      | null;
  };
  
  export type UpdateSubscriptionPayload = {
    plan?: SubscriptionPlan;
  
    status?: SubscriptionStatus;
  
    startsAt?: string;
  
    expiresAt?:
      | string
      | null;
  };

  

  export const subscriptionsService = {
    async getUsage(
      businessId: string
    ) {
      const response =
        await api.get<UsageResponse>(
          `/subscriptions/businesses/${businessId}/usage`
        );
  
      return response.data.data;
    },

    async create(
      businessId: string,
      payload: CreateSubscriptionPayload
    ) {
      const response =
        await api.post(
          `/subscriptions/businesses/${businessId}`,
          payload
        );
    
      return response.data.data
        .subscription;
    },
    
    async update(
      subscriptionId: string,
      payload: UpdateSubscriptionPayload
    ) {
      const response =
        await api.patch(
          `/subscriptions/${subscriptionId}`,
          payload
        );
    
      return response.data.data
        .subscription;
    },
  };