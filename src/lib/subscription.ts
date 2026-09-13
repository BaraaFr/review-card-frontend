import {
    differenceInCalendarDays,
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
    if (
      !subscription.expiresAt
    ) {
      return null;
    }
  
    return Math.max(
      0,
      differenceInCalendarDays(
        parseISO(
          subscription.expiresAt
        ),
        new Date()
      )
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