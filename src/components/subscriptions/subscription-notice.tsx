import {
    CircleCheck,
    Clock3,
    TriangleAlert,
  } from "lucide-react";
  
  import type {
    Subscription,
  } from "@/types/subscription";
  
  import {
    getEffectiveSubscriptionStatus,
    getSubscriptionDaysRemaining,
  } from "@/lib/subscription";
  
  export function SubscriptionNotice({
    subscription,
  }: {
    subscription: Subscription;
  }) {
    const status =
      getEffectiveSubscriptionStatus(
        subscription
      );
  
    const daysRemaining =
      getSubscriptionDaysRemaining(
        subscription
      );
  
    if (
      status === "TRIAL"
    ) {
      return (
        <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Clock3 className="size-4 text-blue-600 dark:text-blue-400" />
          </div>
  
          <div>
            <p className="text-sm font-medium">
              Your free trial is
              active
            </p>
  
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {daysRemaining !==
              null
                ? `${daysRemaining} ${
                    daysRemaining ===
                    1
                      ? "day"
                      : "days"
                  } remaining in your trial.`
                : "Your trial is currently active."}
            </p>
          </div>
        </div>
      );
    }
  
    if (
      status === "ACTIVE"
    ) {
      return (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <CircleCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
  
          <div>
            <p className="text-sm font-medium">
              Your subscription is
              active
            </p>
  
            <p className="mt-1 text-xs text-muted-foreground">
              Your workspace and
              assigned review cards
              are operating normally.
            </p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <TriangleAlert className="size-4 text-amber-600 dark:text-amber-400" />
        </div>
  
        <div>
          <p className="text-sm font-medium">
            Subscription attention
            required
          </p>
  
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            New locations and card
            assignments may be
            restricted. Contact
            ValYou to update your
            subscription.
          </p>
        </div>
      </div>
    );
  }