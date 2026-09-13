import type {
    CustomerStatus,
  } from "@/types/customer";
  
  import type {
    SubscriptionPlan,
    SubscriptionStatus,
  } from "@/types/subscription";
  
  export interface AdminSubscriptionRecord {
    business: {
      id: string;
  
      name: string;
  
      logoUrl:
        | string
        | null;
  
      createdAt: string;
    };
  
    customer: {
      id: string;
  
      name: string;
  
      email: string;
  
      status: CustomerStatus;
    };
  
    subscription: {
      id: string;
  
      plan: SubscriptionPlan;
  
      status: SubscriptionStatus;
  
      startsAt: string;
  
      expiresAt:
        | string
        | null;
  
      createdAt: string;
  
      updatedAt: string;
    } | null;
  
    locationsCount: number;
  }
  
  export type AdminSubscriptionFilterStatus =
    | ""
    | SubscriptionStatus
    | "NO_SUBSCRIPTION";