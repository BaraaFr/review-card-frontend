import {
  api,
} from "@/lib/api";

import {
  idempotentRequest,
} from "@/lib/idempotent-request";

import type {
  Subscription,
  SubscriptionPlan,
  SubscriptionUsageResult,
} from "@/types/subscription";

type SubscriptionResult = {
  data: {
    subscription:
      Omit<
        Subscription,
        "usable" |
          "limits"
      >;
  };
};

export type PaidSubscriptionPayload = {
  plan:
    SubscriptionPlan;

  months:
    number;

  amountCents:
    number;

  paymentMethod:
    | "CASH"
    | "WHISH"
    | "OTHER";

  receiptReference:
    string;
};

export const subscriptionsService = {
  /*
   * READ
   */
  async getUsage(
    businessId:
      string
  ) {
    const response =
      await api.get<{
        data:
          SubscriptionUsageResult;
      }>(
        `/subscriptions/businesses/${businessId}/usage`
      );

    return response
      .data
      .data;
  },

  /*
   * COMMERCIAL MUTATION
   *
   * One trial per business.
   */
  async startTrial(
    businessId:
      string
  ) {
    const response =
      await idempotentRequest<SubscriptionResult>(
        "POST",

        `/subscriptions/businesses/${businessId}/start-trial`
      );

    return response
      .data
      .data
      .subscription;
  },

  /*
   * COMMERCIAL MUTATION
   *
   * Records both:
   *
   * Subscription state
   * +
   * PaymentRecord
   */
  async activatePaid(
    businessId:
      string,

    payload:
      PaidSubscriptionPayload
  ) {
    const response =
      await idempotentRequest<SubscriptionResult>(
        "POST",

        `/subscriptions/businesses/${businessId}/activate-paid`,

        payload
      );

    return response
      .data
      .data
      .subscription;
  },
};