import {
    format,
    isPast,
    parseISO,
  } from "date-fns";
  
  import type {
    Subscription,
    SubscriptionStatus,
  } from "@/types/subscription";
  
  export function getEffectiveSubscriptionStatus(
    subscription: Subscription
  ): SubscriptionStatus {
    if (
      subscription.expiresAt &&
      isPast(
        parseISO(
          subscription.expiresAt
        )
      ) &&
      (
        subscription.status ===
          "ACTIVE" ||
        subscription.status ===
          "TRIAL"
      )
    ) {
      return "EXPIRED";
    }
  
    return subscription.status;
  }
  
  export function getSubscriptionDaysRemaining(
    subscription: Subscription
  ) {
    if (!subscription.expiresAt) {
      return null;
    }
  
    const expiresAt =
      parseISO(
        subscription.expiresAt
      ).getTime();
  
    const now =
      Date.now();
  
    const remainingMs =
      expiresAt -
      now;
  
    if (remainingMs <= 0) {
      return 0;
    }
  
    const DAY_MS =
      24 *
      60 *
      60 *
      1000;
  
    return Math.ceil(
      remainingMs /
        DAY_MS
    );
  }
  export function formatSubscriptionDate(
    date:
      | string
      | null
  ) {
    if (!date) {
      return "No expiry date";
    }
  
    return format(
      parseISO(date),
      "MMM d, yyyy"
    );
  }
  
  export function calculateUsagePercentage(
    used: number,
    limit: number
  ) {
    if (
      limit <= 0
    ) {
      return 0;
    }
  
    return Math.min(
      100,
      Math.round(
        (used / limit) *
          100
      )
    );
  }