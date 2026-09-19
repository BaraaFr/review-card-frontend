"use client";

import { useMemo, useState } from "react";

import { QrCode, Radio, Users, MousePointerClick, Plus } from "lucide-react";

import { useMe } from "@/hooks/auth/use-me";

import { useBusinessStore } from "@/stores/business.store";

import { useBusinesses } from "@/hooks/business/use-businesses";

import {
  useAnalyticsOverview,
  useAnalyticsTimeline,
  useCardAnalytics,
  useStoreAnalytics,
} from "@/hooks/analytics/use-analytics";

import type { DashboardAnalyticsRange } from "@/types/analytics";

import { MetricCard } from "@/components/dashboard/metric-card";

import { InteractionsChart } from "@/components/analytics/interactions-chart";

import { SourceBreakdown } from "@/components/analytics/source-breakdown";

import { TopCards } from "@/components/dashboard/top-cards";

import { TopLocations } from "@/components/dashboard/top-locations";

import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

import { useSubscriptionUsage } from "@/hooks/subscriptions/use-subscription";

import { AnalyticsLockedState } from "@/components/analytics/analytics-locked-state";

import { getEffectiveSubscriptionStatus } from "@/lib/subscription";

import { Building2, Headphones } from "lucide-react";
import { GoogleReputationSection } from "@/components/google/google-reputation-section";
import { useStores } from "@/hooks/stores/use-store";
import { RefreshButton } from "@/components/common/refresh-button";

export default function DashboardPage() {
  const { data: user } = useMe();

  const { data: businesses = [], isLoading: businessesLoading } =
    useBusinesses();

  const { businessId } = useBusinessStore();

  const { data: stores = [], isLoading: storesLoading } = useStores(businessId);


  const subscriptionQuery = useSubscriptionUsage(businessId);

  const [range, setRange] = useState<DashboardAnalyticsRange>("30d");

  const filters = useMemo(
    () => ({
      range,
      businessId: businessId ?? undefined,
    }),
    [range, businessId]
  );

  const subscription = subscriptionQuery.data?.subscription;

  const analyticsAllowed = Boolean(subscription?.usable);

  const overviewQuery = useAnalyticsOverview(filters, analyticsAllowed);

  const timelineQuery = useAnalyticsTimeline(filters, analyticsAllowed);

  const cardsQuery = useCardAnalytics(filters, analyticsAllowed);

  const storesQuery = useStoreAnalytics(filters, analyticsAllowed);

  const isLoading =
    businessesLoading ||
    subscriptionQuery.isLoading ||
    (analyticsAllowed &&
      (overviewQuery.isLoading ||
        timelineQuery.isLoading ||
        cardsQuery.isLoading ||
        storesQuery.isLoading));

  if (!businessesLoading && businesses.length === 0) {
    return <EmptyBusiness />;
  }

  if (!subscriptionQuery.isLoading && !analyticsAllowed) {
    const effectiveStatus = subscription
      ? getEffectiveSubscriptionStatus(subscription)
      : null;

    return (
      <div className="space-y-7">
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Performance overview
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Welcome back, {user?.name.split(" ")[0]}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
          Your subscription is inactive. Review cards and
          analytics are currently unavailable.
          </p>
        </div>

        <AnalyticsLockedState
          reason={
            effectiveStatus === "PAST_DUE"
              ? "PAST_DUE"
              : effectiveStatus === "CANCELED"
              ? "CANCELED"
              : subscription
              ? "EXPIRED"
              : "NO_SUBSCRIPTION"
          }
        />
      </div>
    );
  }

  const overview = overviewQuery.data;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Performance overview
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Welcome back, {user?.name.split(" ")[0]}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            See how customers are interacting with your review cards and where
            your strongest engagement is happening.
          </p>
        </div>
        <div className="flex items-center gap-2">
        <RangeSelector value={range} onChange={setRange} />
        <RefreshButton />

        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Interactions"
              value={overview?.totalInteractions ?? 0}
              icon={MousePointerClick}
              change={overview?.percentageChange}
              description="vs previous period"
            />

            <MetricCard
              title="Unique visitors"
              value={overview?.approximateUniqueVisitors ?? 0}
              icon={Users}
              description="Approximate visitors"
            />

            <MetricCard
              title="NFC taps"
              value={overview?.source.nfc ?? 0}
              icon={Radio}
              description="Tap interactions"
            />

            <MetricCard
              title="QR scans"
              value={overview?.source.qr ?? 0}
              icon={QrCode}
              description="QR interactions"
            />
          </div>

          {/* Main Analytics */}
          <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
            <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
              <div className="mb-6">
                <h3 className="font-semibold">Interactions</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Customer engagement over time
                </p>
              </div>

              <InteractionsChart data={timelineQuery.data?.timeline ?? []} />
            </div>

            <SourceBreakdown
              nfc={overview?.source.nfc ?? 0}
              qr={overview?.source.qr ?? 0}
              unknown={overview?.source.unknown ?? 0}
            />
          </div>

          {/* Performance */}
          <div className="grid gap-4 xl:grid-cols-2">
            <TopCards cards={cardsQuery.data?.cards ?? []} />

            <TopLocations stores={storesQuery.data?.stores ?? []} />
          </div>

          <GoogleReputationSection
            businessId={businessId ?? ""}
            stores={stores}
            isLoading={storesLoading}
            hasAnalyticsAccess={analyticsAllowed}
          />
        </>
      )}
    </div>
  );
}

function RangeSelector({
  value,
  onChange,
}: {
  value: DashboardAnalyticsRange;

  onChange: (value: DashboardAnalyticsRange) => void;
}) {
  const options: {
    value: DashboardAnalyticsRange;
    label: string;
  }[] = [
    {
      value: "today",
      label: "Today",
    },
    {
      value: "7d",
      label: "7 days",
    },
    {
      value: "30d",
      label: "30 days",
    },
  ];

  return (
    <div className="inline-flex w-fit rounded-xl border border-border/70 bg-muted/40 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
              rounded-lg
              px-3
              py-1.5
              text-xs
              font-medium
              transition-all
              ${
                value === option.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function EmptyBusiness() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <Building2 className="size-6 text-emerald-500" />
        </div>

        <p className="mt-6 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Workspace unavailable
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          No business workspace assigned
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your account is active, but no ValYou business workspace is currently
          assigned to it.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <Headphones className="size-4" />
          Contact ValYou for assistance.
        </div>
      </div>
    </div>
  );
}
