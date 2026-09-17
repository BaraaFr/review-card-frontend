"use client";

import {
  Building2,
  CalendarDays,
  CreditCard,
  Crown,
  MapPin,
} from "lucide-react";

import { useSubscriptionUsage } from "@/hooks/subscriptions/use-subscription";

import type { CustomerBusiness } from "@/types/customer";

import {
  formatSubscriptionDate,
  getEffectiveSubscriptionStatus,
} from "@/lib/subscription";

import { SubscriptionStatusBadge } from "@/components/subscriptions/subscription-status";

import { Progress } from "@/components/ui/progress";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Props = {
  business: CustomerBusiness;

  onManageLocations: (business: CustomerBusiness) => void;
  onManageSubscription: (business: CustomerBusiness) => void;
};

export function CustomerBusinessCard({
  business,
  onManageLocations,
  onManageSubscription,
}: Props) {
  const { data, isLoading } = useSubscriptionUsage(business.id);

  const subscription = data?.subscription;

  const locationCount =
    data?.usage.stores ??
    business.stores?.length ??
    business._count?.stores ??
    0;

  const cardCount = data?.usage.cards ?? 0;

  if (isLoading) {
    return <Skeleton className="h-72 rounded-2xl" />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-500/10">
            {business.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logoUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <Building2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold">{business.name}</h3>

            {subscription ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{subscription.plan}</span>

                <SubscriptionStatusBadge
                  status={getEffectiveSubscriptionStatus(subscription)}
                />
              </div>
            ) : (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                No subscription
              </p>
            )}
          </div>
        </div>

        {subscription ? (
          <div className="mt-6 space-y-5">
            <UsageRow
              icon={MapPin}
              label="Locations"
              used={locationCount}
              limit={subscription.limits.stores}
            />

            <UsageRow
              icon={CreditCard}
              label="Active cards"
              used={cardCount}
              limit={subscription.limits.cards}
            />
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          You can prepare this business’s location and cards before starting a
          subscription, within Starter limits. Customer analytics require a
          usable trial or active subscription.
        </div>
        )}
      </div>

      <div className="border-t border-border/60 bg-muted/20 px-5 py-4">
        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            {locationCount} {locationCount === 1 ? "location" : "locations"}
          </span>

          {subscription && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />

              {subscription.expiresAt
                ? `Expires ${formatSubscriptionDate(subscription.expiresAt)}`
                : "No expiry date"}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-border/60 bg-muted/20 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {locationCount} {locationCount === 1 ? "location" : "locations"}
            </p>

            {subscription?.expiresAt && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Expires {formatSubscriptionDate(subscription.expiresAt)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onManageLocations(business)}
            >
              <MapPin className="size-4" />
              Manage locations
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => onManageSubscription(business)}
            >
              <Crown className="size-4" />
              Manage subscription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsageRow({
  icon: Icon,
  label,
  used,
  limit,
}: {
  icon: React.ElementType;

  label: string;

  used: number;

  limit: number;
}) {
  const percentage =
    limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="size-4" />

          {label}
        </div>

        <div className="text-sm">
          <strong>{used}</strong>

          <span className="text-muted-foreground"> / {limit}</span>
        </div>
      </div>

      <Progress value={percentage} />
    </div>
  );
}
