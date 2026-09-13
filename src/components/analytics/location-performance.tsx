"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  MapPin,
  MousePointerClick,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useLocationPerformance } from "@/hooks/analytics/use-location-performance";

import type { AnalyticsRange } from "@/types/analytics-filter";

/*
 * =========================================================
 * Types
 * =========================================================
 */

type Props = {
  storeId: string;

  range: AnalyticsRange;
};

/*
 * =========================================================
 * Helpers
 * =========================================================
 */

function formatDateKey(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",

    day: "numeric",

    year: "numeric",

    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatPeriod(
  from: string | null | undefined,
  to: string | null | undefined
) {
  if (!from || !to) {
    return "Selected period";
  }

  return `${formatDateKey(from)} – ${formatDateKey(to)}`;
}

function formatLastActivity(value: string | Date | null) {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",

    day: "numeric",

    year: "numeric",
  }).format(date);
}

function getLocationName(location: { name: string | null }) {
  return location.name?.trim() || "Unnamed location";
}

function getChangePresentation(change: number | null) {
  if (change === null) {
    return {
      label: "New",

      icon: ArrowRight,

      className: "text-emerald-600 dark:text-emerald-400",
    };
  }

  if (change > 0) {
    return {
      label: `+${change}%`,

      icon: ArrowUpRight,

      className: "text-emerald-600 dark:text-emerald-400",
    };
  }

  if (change < 0) {
    return {
      label: `${change}%`,

      icon: ArrowDownRight,

      className: "text-amber-600 dark:text-amber-400",
    };
  }

  return {
    label: "0%",

    icon: ArrowRight,

    className: "text-muted-foreground",
  };
}

function getLocationStatus(status: string) {
  switch (status) {
    case "GROWING":
    case "IMPROVING":
      return {
        label: "Growing",

        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
      };

    case "STABLE":
    case "HEALTHY":
      return {
        label: "Stable",

        className: "border-border bg-muted/40 text-foreground",
      };

    case "DECLINING":
      return {
        label: "Declining",

        className:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
      };

    case "NO_ACTIVITY":
      return {
        label: "No activity",

        className:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
      };

    case "NEW":
      return {
        label: "New",

        className: "border-border bg-muted/40 text-muted-foreground",
      };

    default:
      return {
        label: status.replaceAll("_", " ").toLowerCase(),

        className: "border-border bg-muted/40 text-muted-foreground",
      };
  }
}

/*
 * =========================================================
 * Loading
 * =========================================================
 */

function LocationPerformanceLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-44" />

        <Skeleton className="h-4 w-72" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div
          className="
            grid
            grid-cols-2
            gap-3

            lg:grid-cols-4
          "
        >
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-48 rounded-xl" />
      </CardContent>
    </Card>
  );
}

/*
 * =========================================================
 * Component
 * =========================================================
 */

export function LocationPerformance({ storeId, range }: Props) {
  const { data, isLoading, isError } = useLocationPerformance({
    storeId,
    range,
  });

  /*
   * =======================================================
   * Loading
   * =======================================================
   */

  if (isLoading) {
    return <LocationPerformanceLoading />;
  }

  /*
   * =======================================================
   * Error
   * =======================================================
   */

  if (isError || !data) {
    return (
      <Card
        className="
          border-amber-200
          dark:border-amber-900/50
        "
      >
        <CardContent className="flex min-h-40 items-center justify-center p-6">
          <div className="text-center">
            <AlertTriangle
              className="
                mx-auto
                size-6
                text-amber-600

                dark:text-amber-400
              "
            />

            <p className="mt-3 text-sm font-medium">
              Location performance could not be loaded.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Please try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { period, summary, locations } = data;

  const bestLocationId = summary.bestLocation?.id ?? null;

  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (
    <Card
      className="
        overflow-hidden
        border-border/60
        shadow-sm
      "
    >
      {/* =================================================
          Header
      ================================================= */}

      <CardHeader
        className="
          border-b
          border-border/60
          bg-muted/10
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3

            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="
                  flex size-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-emerald-50
                  text-emerald-600

                  dark:bg-emerald-950/30
                  dark:text-emerald-400
                "
              >
                <Building2 className="size-4" />
              </div>

              <CardTitle className="text-base">Location Performance</CardTitle>
            </div>

            <CardDescription>
              Compare customer engagement across all locations in this business.
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className="
              w-fit
              bg-background
              font-normal
              text-muted-foreground
            "
          >
            {formatPeriod(period.from, period.to)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-5 sm:p-6">
        {/* =================================================
            Summary
        ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-3

            lg:grid-cols-4
          "
        >
          {/* Total interactions */}

          <div className="rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MousePointerClick className="size-4" />

              <span className="text-xs font-medium">Interactions</span>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {summary.totalInteractions}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Across all locations
            </p>
          </div>

          {/* Unique visitors */}

          <div className="rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />

              <span className="text-xs font-medium">Unique visitors</span>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {summary.totalUniqueVisitors}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">Business-wide</p>
          </div>

          {/* Active locations */}

          <div className="rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />

              <span className="text-xs font-medium">With activity</span>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {summary.locationsWithActivity}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              of {summary.totalLocations} locations
            </p>
          </div>

          {/* Needs attention */}

          <div className="rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="size-4" />

              <span className="text-xs font-medium">Needs attention</span>
            </div>

            <p
              className={
                summary.locationsNeedingAttention > 0
                  ? "mt-3 text-2xl font-semibold tracking-tight text-amber-600 dark:text-amber-400"
                  : "mt-3 text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400"
              }
            >
              {summary.locationsNeedingAttention}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Declining or inactive
            </p>
          </div>
        </div>

        {/* =================================================
            Best location
        ================================================= */}

        {summary.bestLocation && (
          <div
            className="
              flex
              flex-col
              gap-3
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50/60
              p-4

              dark:border-emerald-900/50
              dark:bg-emerald-950/20

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-emerald-100
                  text-emerald-700

                  dark:bg-emerald-900/40
                  dark:text-emerald-400
                "
              >
                <Trophy className="size-4" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  Strongest location
                </p>

                <p className="mt-0.5 text-sm font-semibold">
                  {getLocationName(summary.bestLocation)}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-semibold">
                {summary.bestLocation.interactions} interactions
              </p>

              <p className="text-xs text-muted-foreground">
                {summary.bestLocation.uniqueVisitors} unique visitors
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            Empty
        ================================================= */}

        {locations?.length === 0 ? (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-border
              bg-muted/10
              px-6
              py-12
              text-center
            "
          >
            <MapPin
              className="
                mx-auto
                size-7
                text-muted-foreground/60
              "
            />

            <p className="mt-3 text-sm font-medium">No locations available</p>
          </div>
        ) : (
          <>
            {/* =============================================
                Desktop
            ============================================= */}

            <div
              className="
                hidden
                overflow-hidden
                rounded-xl
                border
                border-border/60

                md:block
              "
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Location</TableHead>

                    <TableHead className="text-right">Interactions</TableHead>

                    <TableHead className="text-right">Visitors</TableHead>

                    <TableHead className="text-right">Share</TableHead>

                    <TableHead className="text-right">Change</TableHead>

                    <TableHead>Last activity</TableHead>

                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {locations?.map((location) => {
                    const change = getChangePresentation(
                      location.changePercentage
                    );

                    const ChangeIcon = change.icon;

                    const status = getLocationStatus(location.status);

                    const isBest = location.id === bestLocationId;

                    return (
                      <TableRow
                        key={location.id}
                        className={
                          location.isSelected
                            ? "bg-emerald-50/50 dark:bg-emerald-950/10"
                            : undefined
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isBest && (
                              <Trophy className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            )}

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium">
                                  {getLocationName(location)}
                                </p>

                                {location.isSelected && (
                                  <Badge
                                    variant="outline"
                                    className="
                                        border-emerald-200
                                        bg-emerald-50
                                        text-[10px]
                                        text-emerald-700

                                        dark:border-emerald-900/50
                                        dark:bg-emerald-950/30
                                        dark:text-emerald-400
                                      "
                                  >
                                    Selected
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-right font-medium">
                          {location.currentInteractions}
                        </TableCell>

                        <TableCell className="text-right">
                          {location.uniqueVisitors}
                        </TableCell>

                        <TableCell className="text-right">
                          {location.activityShare}%
                        </TableCell>

                        <TableCell className="text-right">
                          <div
                            className={`
                                inline-flex
                                items-center
                                justify-end
                                gap-1
                                text-sm
                                font-medium
                                ${change.className}
                              `}
                          >
                            <ChangeIcon className="size-3.5" />

                            {change.label}
                          </div>
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                          {formatLastActivity(location.lastInteractionAt)}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <Badge
                              variant="outline"
                              className={status.className}
                            >
                              {status.label}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* =============================================
                Mobile
            ============================================= */}

            <div className="space-y-3 md:hidden">
              {locations?.map((location) => {
                const change = getChangePresentation(location.changePercentage);

                const ChangeIcon = change.icon;

                const status = getLocationStatus(location.status);

                const isBest = location.id === bestLocationId;

                return (
                  <div
                    key={location.id}
                    className={
                      location.isSelected
                        ? "rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/10"
                        : "rounded-xl border border-border/60 p-4"
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {isBest && (
                            <Trophy className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          )}

                          <p className="truncate text-sm font-semibold">
                            {getLocationName(location)}
                          </p>
                        </div>

                        {location.isSelected && (
                          <Badge
                            variant="outline"
                            className="
                                mt-2
                                border-emerald-200
                                bg-emerald-50
                                text-[10px]
                                text-emerald-700

                                dark:border-emerald-900/50
                                dark:bg-emerald-950/30
                                dark:text-emerald-400
                              "
                          >
                            Selected location
                          </Badge>
                        )}
                      </div>

                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Interactions
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {location.currentInteractions}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Visitors
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {location.uniqueVisitors}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Share</p>

                        <p className="mt-1 text-sm font-semibold">
                          {location.activityShare}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                      <div
                        className={`
                            inline-flex
                            items-center
                            gap-1
                            text-xs
                            font-medium
                            ${change.className}
                          `}
                      >
                        <ChangeIcon className="size-3.5" />
                        {change.label} vs previous period
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {formatLastActivity(location.lastInteractionAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
