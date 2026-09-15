import {
  CircleCheck,
  Clock3,
  TriangleAlert,
  CircleOff,
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

  /*
   * =====================================================
   * Subscription unavailable
   * =====================================================
   */

  if (!subscription.usable) {
    const message =
      status === "CANCELED"
        ? "Your subscription has been canceled. Your NFC and QR review cards are currently unavailable."
        : status === "PAST_DUE"
          ? "Your subscription requires attention. Your NFC and QR review cards are currently unavailable."
          : "Your subscription has expired. Your NFC and QR review cards are currently unavailable.";

    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
          <CircleOff className="size-4 text-red-600 dark:text-red-400" />
        </div>

        <div>
          <p className="text-sm font-medium">
            Review cards unavailable
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {message}
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Contact ValYou to renew your subscription.
            Your existing cards will automatically
            work again after renewal.
          </p>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * Expiring within 5 days
   * =====================================================
   */

  if (
    daysRemaining !== null &&
    daysRemaining <= 5
  ) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <TriangleAlert className="size-4 text-amber-600 dark:text-amber-400" />
        </div>

        <div>
          <p className="text-sm font-medium">
            Subscription expires soon
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Your subscription expires in{" "}
            {daysRemaining}{" "}
            {daysRemaining === 1
              ? "day"
              : "days"}.
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Renew before the expiration date to
            keep your NFC and QR review cards
            working without interruption.
          </p>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * Trial
   * =====================================================
   */

  if (status === "TRIAL") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
          <Clock3 className="size-4 text-blue-600 dark:text-blue-400" />
        </div>

        <div>
          <p className="text-sm font-medium">
            Your free trial is active
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {daysRemaining !== null
              ? `${daysRemaining} ${
                  daysRemaining === 1
                    ? "day"
                    : "days"
                } remaining in your trial.`
              : "Your trial is currently active."}
          </p>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * Normal active subscription
   * =====================================================
   */

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
        <CircleCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div>
        <p className="text-sm font-medium">
          Your subscription is active
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Your workspace and assigned NFC and QR
          review cards are operating normally.
        </p>
      </div>
    </div>
  );
}