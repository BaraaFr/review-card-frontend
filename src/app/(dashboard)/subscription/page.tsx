"use client";

import {
  Building2,
  CreditCard,
  Plus,
} from "lucide-react";

import {
  useBusinessStore,
} from "@/stores/business.store";

import {
  useBusinesses,
} from "@/hooks/business/use-businesses";

import {
  useSubscriptionUsage,
} from "@/hooks/subscriptions/use-subscription";

import {
  SUBSCRIPTION_PLANS,
} from "@/lib/subscription-plans";

import {
  getEffectiveSubscriptionStatus,
} from "@/lib/subscription";

import {
  SubscriptionOverview,
} from "@/components/subscriptions/subscription-overview";

import {
  SubscriptionNotice,
} from "@/components/subscriptions/subscription-notice";

import {
  UsageMeter,
} from "@/components/subscriptions/usage-meter";

import {
  PlanCard,
} from "@/components/subscriptions/plan-card";

import {
  SubscriptionSkeleton,
} from "@/components/subscriptions/subscription-skeleton";

import {
  Headphones,
} from "lucide-react";
export default function SubscriptionPage() {
  const {
    businessId,
  } =
    useBusinessStore();

  const {
    data: businesses = [],
    isLoading:
      businessesLoading,
  } =
    useBusinesses();

  const {
    data,
    isLoading:
      subscriptionLoading,
    isError,
  } =
    useSubscriptionUsage(
      businessId
    );

  const selectedBusiness =
    businesses.find(
      (business) =>
        business.id ===
        businessId
    );

  if (
    businessesLoading
  ) {
    return (
      <SubscriptionSkeleton />
    );
  }

  if (!businessId) {
    return (
      <NoBusiness />
    );
  }

  if (
    subscriptionLoading
  ) {
    return (
      <SubscriptionSkeleton />
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div className="max-w-md">
          <CreditCard className="mx-auto size-8 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">
            Unable to load
            subscription
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't load your
            subscription information.
            Try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const subscription =
    data?.subscription;

  if (!subscription) {
    return (
      <NoSubscription
        businessName={
          selectedBusiness
            ?.name
        }
      />
    );
  }

  const effectiveStatus =
    getEffectiveSubscriptionStatus(
      subscription
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {
            selectedBusiness
              ?.name
          }
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          Subscription
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          View your current plan,
          account limits and
          workspace usage.
        </p>
      </div>

      {/* Current Plan */}
      <SubscriptionOverview
        subscription={
          subscription
        }
      />

      <SubscriptionNotice
        subscription={
          subscription
        }
      />

      {/* Usage */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            Plan usage
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            See how much of your
            current plan capacity
            you're using.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <UsageMeter
            title="Locations"
            description="Business branches in this workspace"
            icon={
              Building2
            }
            used={
              data?.usage
                .stores ??
              0
            }
            limit={
              subscription
                .limits
                .stores
            }
          />

          <UsageMeter
            title="Active review cards"
            description="Physical cards currently assigned"
            icon={
              CreditCard
            }
            used={
              data?.usage
                .cards ??
              0
            }
            limit={
              subscription
                .limits
                .cards
            }
          />
        </div>
      </section>

      {/* Plans */}
      <section className="space-y-5 pt-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Available plans
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose the capacity
              that fits your
              business.
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Plan changes are
            currently handled by
            ValYou.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {SUBSCRIPTION_PLANS.map(
            (plan) => (
              <PlanCard
                key={
                  plan.id
                }
                plan={
                  plan
                }
                currentPlan={
                  subscription.plan
                }
              />
            )
          )}
        </div>
      </section>

      {/* Footer note */}
      <div className="rounded-2xl border border-border/70 bg-muted/30 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">
              Need more capacity?
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Contact ValYou to
              upgrade or change your
              plan. Online payment
              management will be
              available in a future
              version.
            </p>
          </div>

          {effectiveStatus ===
            "EXPIRED" && (
            <span className="shrink-0 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              Plan expired
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


function NoBusiness() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <Building2 className="size-6 text-emerald-500" />
        </div>

        <h2 className="mt-5 text-xl font-semibold">
          No workspace assigned
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Subscription information
          becomes available after a
          ValYou business
          workspace is assigned to
          your account.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <Headphones className="size-4" />

          Contact ValYou for
          assistance.
        </div>
      </div>
    </div>
  );
}
function NoSubscription({
  businessName,
}: {
  businessName?: string;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10">
          <CreditCard className="size-6 text-amber-500" />
        </div>

        <p className="mt-6 text-sm font-medium text-amber-600 dark:text-amber-400">
          Subscription required
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          No active plan
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {businessName
            ? `${businessName} doesn't currently have a ValYou subscription.`
            : "This business doesn't currently have a ValYou subscription."}
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Contact ValYou to
          activate a trial or
          subscription for this
          workspace.
        </p>
      </div>
    </div>
  );
}