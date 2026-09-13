export type SubscriptionPlan =
  | "STARTER"
  | "PRO"
  | "BUSINESS";

export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED";

export interface SubscriptionLimits {
  stores: number;
  cards: number;
}

export interface Subscription {
  id: string;

  businessId: string;

  plan: SubscriptionPlan;

  status: SubscriptionStatus;

  startsAt: string;

  expiresAt:
    | string
    | null;

  createdAt: string;

  updatedAt: string;

  usable: boolean;

  limits: SubscriptionLimits;
}

export interface SubscriptionUsage {
  stores: number;
  cards: number;
}

export interface SubscriptionRemaining {
  stores: number;
  cards: number;
}

export interface SubscriptionUsageResult {
  subscription:
    | Subscription
    | null;

  usage: SubscriptionUsage;

  remaining: SubscriptionRemaining;
}