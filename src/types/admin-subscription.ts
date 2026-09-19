import type {
  CustomerStatus,
} from "@/types/customer";

import type {
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/types/subscription";

export type RenewalFollowUpStatus =
  | "CONTACTED"
  | "INTERESTED"
  | "DECLINED";

export interface RenewalFollowUp {
  id: string;

  status:
    RenewalFollowUpStatus;

  note:
    string | null;

  expiresAt:
    string;

  contactedAt:
    string | null;

  nextFollowUpAt:
    string | null;

  updatedAt:
    string;
}

export interface AdminSubscriptionRecord {
  business: {
    id: string;

    name: string;

    logoUrl:
      string | null;

    createdAt:
      string;
  };

  customer: {
    id: string;

    name: string;

    email: string;

    phoneNumber:
      string | null;

    status:
      CustomerStatus;
  };

  subscription: {
    id: string;

    plan:
      SubscriptionPlan;

    status:
      SubscriptionStatus;

    startsAt:
      string;

    expiresAt:
      string | null;

    createdAt:
      string;

    updatedAt:
      string;
  } | null;

  renewalFollowUp:
    RenewalFollowUp | null;

  hasRecordedSubscriptionPayment:
    boolean;

  locationsCount:
    number;
}

export type AdminSubscriptionFilterStatus =
  | ""
  | SubscriptionStatus
  | "NO_SUBSCRIPTION";