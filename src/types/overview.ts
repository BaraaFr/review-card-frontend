import type {
    CustomerStatus,
  } from "@/types/customer";
  
  export interface AdminOverview {
    customers: {
      total: number;
      active: number;
      pending: number;
      disabled: number;
    };
  
    businesses: {
      total: number;
    };
  
    subscriptions: {
      active: number;
      trial: number;
      pastDue: number;
      canceled: number;
      expired: number;
      noSubscription: number;
    };
  
    cards: {
      total: number;
      ready: number;
      active: number;
      inactive: number;
    };
  
    activity: {
      today: number;
  
      last7Days: number;
  
      previous7Days: number;
  
      percentageChange:
        | number
        | null;
  
      timeline: {
        date: string;
        total: number;
        nfc: number;
        qr: number;
      }[];
    };
  
    recentCustomers: {
      id: string;
      name: string;
      email: string;
      status: CustomerStatus;
      createdAt: string;
  
      businesses: {
        id: string;
        name: string;
      }[];
    }[];
  
    attention: {
      pendingActivations: number;
  
      expiredSubscriptions: number;
  
      paymentIssues: number;
  
      expiringSoon: {
        count: number;
  
        businesses: {
          businessId: string;
          businessName: string;
  
          customerId: string;
          customerName: string;
  
          plan:
            | "STARTER"
            | "PRO"
            | "BUSINESS";
  
          status:
            | "ACTIVE"
            | "TRIAL";
  
          expiresAt: string;
        }[];
      };
  
      noSubscription: {
        count: number;
  
        businesses: {
          businessId: string;
          businessName: string;
  
          customerId: string;
          customerName: string;
        }[];
      };
    };
  }