import {
    api,
  } from "@/lib/api";
  
  import type {
    AdminSubscriptionRecord,
  } from "@/types/admin-subscription";
  
  type Response = {
    success: boolean;
  
    data: {
      subscriptions:
        AdminSubscriptionRecord[];
    };
  };
  
  export const adminSubscriptionsService = {
    async getAll() {
      const response =
        await api.get<Response>(
          "/admin/subscriptions"
        );
  
      return response.data.data
        .subscriptions;
    },
  };