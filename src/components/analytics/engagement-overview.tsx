"use client";

import type {
  ElementType,
  ReactNode,
} from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Laptop,
  MousePointerClick,
  QrCode,
  RotateCcw,
  Smartphone,
  Tablet,
  Users,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import {
  useEngagementAnalytics,
} from "@/hooks/analytics/use-engagement-analytics";
import { AnalyticsRange } from "@/types/analytics-filter";

type EngagementOverviewProps = {
  storeId: string;
  range: AnalyticsRange;
};
/*
 * =======================================================
 * Change indicator
 * =======================================================
 */

function ChangeIndicator({
  change,
}: {
  change: number | null;
}) {
  if (
    change === null
  ) {
    return (
      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
        New activity
      </span>
    );
  }

  if (
    change > 0
  ) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <ArrowUpRight className="size-3.5" />

        {change}%
      </span>
    );
  }

  if (
    change < 0
  ) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
        <ArrowDownRight className="size-3.5" />

        {Math.abs(
          change
        )}
        %
      </span>
    );
  }

  return (
    <span className="text-xs font-medium text-muted-foreground">
      No change
    </span>
  );
}

/*
 * =======================================================
 * Main component
 * =======================================================
 */

export function EngagementOverview({
  storeId,
  range
}: EngagementOverviewProps) {
  const {
    data,
    isLoading,
    isError,
  } =
    useEngagementAnalytics({
      storeId,
      range,
    });

  /*
   * =====================================================
   * Loading
   * =====================================================
   */

  if (
    isLoading
  ) {
    return (
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (
              _,
              index
            ) => (
              <Skeleton
                key={
                  index
                }
                className="h-32 rounded-xl"
              />
            )
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />

          <Skeleton className="h-64 rounded-xl" />
        </div>
      </section>
    );
  }

  /*
   * =====================================================
   * Error
   * =====================================================
   */

  if (
    isError ||
    !data
  ) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Activity className="size-5" />
          </div>

          <p className="mt-4 font-medium">
            Unable to load customer engagement
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      {/* =============================================
          Section heading
      ============================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-200/70 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Activity className="size-4" />
            </div>

            <h2 className="text-lg font-semibold tracking-tight">
              Customer Engagement
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Understand how customers interact with your ValYou cards.
          </p>
        </div>
      </div>

      {/* =============================================
          Metric cards
      ============================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={
            MousePointerClick
          }
          label="Interactions"
          value={
            data
              .interactions
              .current
          }
          footer={
            <div className="flex flex-wrap items-center gap-1.5">
              <ChangeIndicator
                change={
                  data
                    .interactions
                    .changePercentage
                }
              />

              {/* <span className="text-xs text-muted-foreground">
                vs previous {days} days
              </span> */}
            </div>
          }
        />

        <MetricCard
          icon={
            Users
          }
          label="Unique visitors"
          value={
            data
              .visitors
              .unique
          }
          description="Anonymous customers"
        />

        <MetricCard
          icon={
            Smartphone
          }
          label="New visitors"
          value={
            data
              .visitors
              .new
          }
          description={`${data.visitors.newPercentage}% of visitors`}
        />

        <MetricCard
          icon={
            RotateCcw
          }
          label="Returning visitors"
          value={
            data
              .visitors
              .returning
          }
          description={`${data.visitors.returningPercentage}% of visitors`}
        />
      </div>

      {/* =============================================
          Detailed cards
      ============================================= */}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ===========================================
            How customers engage
        =========================================== */}

        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-50/50 via-background to-background px-5 py-4 dark:from-emerald-950/20 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  How customers engage
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">
                  Compare NFC taps with QR scans.
                </p>
              </div>

              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <MousePointerClick className="size-4" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-5 sm:p-6">
            <SourceRow
              icon={
                Smartphone
              }
              label="NFC"
              description="Tap interactions"
              count={
                data
                  .sources
                  .nfc
              }
              percentage={
                data
                  .sources
                  .nfcPercentage
              }
            />

            <SourceRow
              icon={
                QrCode
              }
              label="QR"
              description="Scan interactions"
              count={
                data
                  .sources
                  .qr
              }
              percentage={
                data
                  .sources
                  .qrPercentage
              }
            />

            {data.sources
              .unknown >
              0 && (
              <SourceRow
                icon={
                  MousePointerClick
                }
                label="Other"
                description="Unknown source"
                count={
                  data
                    .sources
                    .unknown
                }
                percentage={
                  data
                    .sources
                    .unknownPercentage
                }
              />
            )}
          </CardContent>
        </Card>

        {/* ===========================================
            Customer devices
        =========================================== */}

        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-50/50 via-background to-background px-5 py-4 dark:from-emerald-950/20 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  Customer devices
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">
                  Devices used during customer interactions.
                </p>
              </div>

              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <Smartphone className="size-4" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-5 sm:p-6">
            <DeviceRow
              icon={
                Smartphone
              }
              label="Mobile"
              count={
                data
                  .devices
                  .mobile
              }
              percentage={
                data
                  .devices
                  .mobilePercentage
              }
            />

            <DeviceRow
              icon={
                Laptop
              }
              label="Desktop"
              count={
                data
                  .devices
                  .desktop
              }
              percentage={
                data
                  .devices
                  .desktopPercentage
              }
            />

            <DeviceRow
              icon={
                Tablet
              }
              label="Tablet"
              count={
                data
                  .devices
                  .tablet
              }
              percentage={
                data
                  .devices
                  .tabletPercentage
              }
            />

            {data.devices
              .unknown >
              0 && (
              <DeviceRow
                icon={
                  Activity
                }
                label="Other"
                count={
                  data
                    .devices
                    .unknown
                }
                percentage={
                  data
                    .devices
                    .unknownPercentage
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/*
 * =======================================================
 * Metric card
 * =======================================================
 */

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  footer,
}: {
  icon:
    ElementType;

  label:
    string;

  value:
    number;

  description?:
    string;

  footer?:
    ReactNode;
}) {
  return (
    <Card className="group border-border/60 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-900/70">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {label}
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
              {value}
            </p>
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:group-hover:bg-emerald-950/50">
            <Icon className="size-4" />
          </div>
        </div>

        {description && (
          <p className="mt-2 text-xs text-muted-foreground">
            {description}
          </p>
        )}

        {footer && (
          <div className="mt-2">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/*
 * =======================================================
 * Source row
 * =======================================================
 */

function SourceRow({
  icon: Icon,
  label,
  description,
  count,
  percentage,
}: {
  icon:
    ElementType;

  label:
    string;

  description:
    string;

  count:
    number;

  percentage:
    number;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Icon className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium">
              {label}
            </p>

            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold tabular-nums">
            {percentage}%
          </p>

          <p className="text-xs text-muted-foreground">
            {count}{" "}
            {count === 1
              ? "interaction"
              : "interactions"}
          </p>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{
            width:
              `${Math.min(
                percentage,
                100
              )}%`,
          }}
        />
      </div>
    </div>
  );
}

/*
 * =======================================================
 * Device row
 * =======================================================
 */

function DeviceRow({
  icon: Icon,
  label,
  count,
  percentage,
}: {
  icon:
    ElementType;

  label:
    string;

  count:
    number;

  percentage:
    number;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
            <Icon className="size-4" />
          </div>

          <div>
            <p className="text-sm font-medium">
              {label}
            </p>

            <p className="text-xs text-muted-foreground">
              {count}{" "}
              {count === 1
                ? "interaction"
                : "interactions"}
            </p>
          </div>
        </div>

        <span className="text-sm font-semibold tabular-nums">
          {percentage}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{
            width:
              `${Math.min(
                percentage,
                100
              )}%`,
          }}
        />
      </div>
    </div>
  );
}