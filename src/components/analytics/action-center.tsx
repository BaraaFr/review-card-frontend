"use client";

import Link
  from "next/link";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  Lightbulb,
  MapPin,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/badge";

import {
  buttonVariants,
} from "@/components/ui/button";

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
  cn,
} from "@/lib/utils";

import {
  useActionCenter,
} from "@/hooks/analytics/use-action-center";

import type {
  ActionCenterItem,
} from "@/types/action-center";
import { AnalyticsRange } from "@/types/analytics-filter";

type ActionCenterProps = {
  storeId:string;
  range:AnalyticsRange
};

/*
 * =======================================================
 * Main
 * =======================================================
 */

export function ActionCenter({
  storeId,
  range
}: ActionCenterProps) {
  const {
    data,
    isLoading,
    isError,
  } =
    useActionCenter({
      storeId,
      range,
    });

  if (
    isLoading
  ) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-7 w-44" />

          <Skeleton className="h-20 rounded-xl" />

          <Skeleton className="h-20 rounded-xl" />

          <Skeleton className="h-20 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (
    isError ||
    !data
  ) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
          <Lightbulb className="size-6 text-muted-foreground" />

          <p className="mt-3 font-medium">
            Unable to load recommendations
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  const warnings =
    data.warnings.filter(
      (
        item
      ) =>
        item.severity ===
        "WARNING"
    );

  const information =
    data.warnings.filter(
      (
        item
      ) =>
        item.severity ===
        "INFO"
    );

  return (
    <section className="space-y-4">
      {/* =============================================
          Heading
      ============================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-200/70 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Lightbulb className="size-4" />
            </div>

            <h2 className="text-lg font-semibold tracking-tight">
              Action Center
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            ValYou monitors your engagement and surfaces what deserves your attention.
          </p>
        </div>

        {data.summary
          .warningCount >
        0 ? (
          <Badge
            variant="outline"
            className="w-fit border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400"
          >
            {
              data.summary
                .warningCount
            }{" "}
            {data.summary
              .warningCount ===
            1
              ? "item"
              : "items"}{" "}
            need attention
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            <CheckCircle2 className="mr-1.5 size-3.5" />

            Looking good
          </Badge>
        )}
      </div>

      {/* =============================================
          Warnings
      ============================================= */}

      {warnings.length >
        0 && (
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="border-b border-border/60 bg-amber-50/40 px-5 py-4 dark:bg-amber-950/10 sm:px-6">
            <div className="flex items-center gap-2">
              <CircleAlert className="size-4 text-amber-600 dark:text-amber-400" />

              <CardTitle className="text-sm font-semibold">
                Needs your attention
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="divide-y divide-border/60 p-0">
            {warnings.map(
              (
                item
              ) => (
                <ActionItemRow
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </CardContent>
        </Card>
      )}

      {/* =============================================
          Informational recommendations
      ============================================= */}

      {information.length >
        0 && (
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="border-b border-border/60 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-emerald-600 dark:text-emerald-400" />

              <CardTitle className="text-sm font-semibold">
                Recommendations
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="divide-y divide-border/60 p-0">
            {information.map(
              (
                item
              ) => (
                <ActionItemRow
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </CardContent>
        </Card>
      )}

      {/* =============================================
          Highlights
      ============================================= */}

      {data.highlights
        .length >
        0 && (
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-50/50 via-background to-background px-5 py-4 dark:from-emerald-950/20 sm:px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />

              <CardTitle className="text-sm font-semibold">
                Highlights
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="divide-y divide-border/60 p-0">
            {data.highlights.map(
              (
                item
              ) => (
                <ActionItemRow
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}

/*
 * =======================================================
 * Individual intelligence item
 * =======================================================
 */

function ActionItemRow({
  item,
}: {
  item:
    ActionCenterItem;
}) {
  const config =
    getItemConfig(
      item
    );

  const href =
    getItemHref(
      item
    );

  return (
    <div className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            config.iconContainer
          )}
        >
          <config.Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {item.title}
          </p>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            {
              item.description
            }
          </p>

          {item.metric && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {
                  item.metric
                    .label
                }
              </span>

              <span className="text-xs font-semibold tabular-nums">
                {
                  item.metric
                    .value
                }
              </span>
            </div>
          )}
        </div>
      </div>

      {href && (
        <Link
          href={
            href
          }
          className={cn(
            buttonVariants({
              variant:
                "ghost",

              size:
                "sm",
            }),
            "w-fit shrink-0"
          )}
        >
          View

          <ArrowRight className="ml-1 size-3.5" />
        </Link>
      )}
    </div>
  );
}

/*
 * =======================================================
 * Visual configuration
 * =======================================================
 */

function getItemConfig(
  item:
    ActionCenterItem
) {
  if (
    item.severity ===
    "WARNING"
  ) {
    return {
      Icon:
        AlertTriangle,

      iconContainer:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    };
  }

  if (
    item.type ===
    "TOP_CARD"
  ) {
    return {
      Icon:
        Trophy,

      iconContainer:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    };
  }

  if (
    item.type ===
    "TOP_LOCATION"
  ) {
    return {
      Icon:
        MapPin,

      iconContainer:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    };
  }

  if (
    item.type ===
    "ALL_HEALTHY"
  ) {
    return {
      Icon:
        CheckCircle2,

      iconContainer:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    };
  }

  if (
    item.entityType ===
    "CARD"
  ) {
    return {
      Icon:
        CreditCard,

      iconContainer:
        "bg-muted text-muted-foreground",
    };
  }

  return {
    Icon:
      Lightbulb,

    iconContainer:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  };
}

/*
 * =======================================================
 * Destination links
 * =======================================================
 */

function getItemHref(
  item:
    ActionCenterItem
) {
  switch (
    item.entityType
  ) {
    case "CARD":
      return "/cards";

    case "LOCATION":
    case "GOOGLE":
      return "/locations";

    default:
      return null;
  }
}