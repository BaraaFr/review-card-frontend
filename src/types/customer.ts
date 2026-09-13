import type {
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/types/subscription";

export type CustomerStatus =
  | "PENDING"
  | "ACTIVE"
  | "DISABLED";

export interface CustomerSubscription {
  id: string;

  plan: SubscriptionPlan;

  status: SubscriptionStatus;

  startsAt: string;

  expiresAt:
  | string
  | null;
}

export interface CustomerBusiness {
  id: string;

  name: string;

  logoUrl:
  | string
  | null;

  ownerId?: string;

  createdAt?: string;

  updatedAt?: string;

  subscriptions:
  CustomerSubscription[];

  stores?: {
    id: string;

    name: string;

    address:
    | string
    | null;

    googleReviewUrl:
    | string
    | null;
  }[];

  _count?: {
    stores: number;
  };
}

export interface Customer {
  id: string;

  name: string;

  email: string;

  status: CustomerStatus;

  createdAt: string;

  businesses:
  CustomerBusiness[];
}

export type SubscriptionSetup =
  | {
    mode: "TRIAL";

    plan:
    | "STARTER"
    | "PRO"
    | "BUSINESS";

    days: number;
  }
  | {
    mode: "ACTIVE";

    plan:
    | "STARTER"
    | "PRO"
    | "BUSINESS";

    expiresAt?:
    | string
    | null;
  }
  | {
    mode: "NONE";
  };

export interface CreateCustomerPayload {
  name: string;

  email: string;

  business: {
    name: string;

    logoUrl?:
    | string
    | null;
  };

  subscription:
  SubscriptionSetup;
}

export interface CustomerCreationResult {
  user: {
    id: string;

    name: string;

    email: string;

    role:
    "BUSINESS_OWNER";

    status: CustomerStatus;

    createdAt: string;
  };

  business: {
    id: string;

    name: string;

    logoUrl:
    | string
    | null;
  };

  subscription:
  | CustomerSubscription
  | null;

  activationUrl: string;

  activationExpiresAt: string;
}

export interface ActivationResult {
  activationUrl: string;

  activationExpiresAt: string;
}
export interface CustomerDetail {
  id: string;

  name: string;

  email: string;

  status: CustomerStatus;

  createdAt: string;

  businesses:
  CustomerBusiness[];
}

export interface CreateAdditionalBusinessPayload {
  name: string;

  logoUrl?:
    | string
    | null;

  location: {
    name: string;

    address?:
      | string
      | null;

    googleReviewUrl: string;
  };

  subscription:
    SubscriptionSetup;
}