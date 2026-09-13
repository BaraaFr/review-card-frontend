"use client";

import {
  AlertTriangle,
  CreditCard,
  MousePointerClick,
  Trophy,
  Users,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useCardPerformance,
} from "@/hooks/analytics/use-card-performance";

import type {
  AnalyticsRange,
} from "@/types/analytics-filter";

/*
 * =========================================================
 * Types
 * =========================================================
 */

type CardPerformanceProps = {
  storeId: string;
  range: AnalyticsRange;
};

/*
 * =========================================================
 * Helpers
 * =========================================================
 */

function formatDateKey(
  value:
    string | null | undefined
) {
  if (
    !value
  ) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] =
    value
      .split("-")
      .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",

      timeZone:
        "UTC",
    }
  ).format(
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    )
  );
}

function formatPeriod(
  from:
    string | null | undefined,
  to:
    string | null | undefined
) {
  if (
    !from ||
    !to
  ) {
    return "Selected period";
  }

  return `${formatDateKey(
    from
  )} – ${formatDateKey(
    to
  )}`;
}

function formatLastActivity(
  value:
    string | Date | null
) {
  if (
    !value
  ) {
    return "Never";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Never";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",
    }
  ).format(
    date
  );
}

function getCardName(
  card: {
    label:
      string | null;

    code:
      string;
  }
) {
  return (
    card.label?.trim() ||
    `Card ${card.code.slice(
      0,
      6
    )}`
  );
}

function getActivityStatus(
  status:
    string
) {
  switch (
    status
  ) {
    case "ACTIVE":
      return {
        label:
          "Active",

        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
      };

    case "NO_RECENT_ACTIVITY":
      return {
        label:
          "Needs attention",

        className:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
      };

    case "NEVER_USED":
      return {
        label:
          "Never used",

        className:
          "border-border bg-muted/50 text-muted-foreground",
      };

    default:
      return {
        label:
          status
            .replaceAll(
              "_",
              " "
            )
            .toLowerCase(),

        className:
          "border-border bg-muted/50 text-muted-foreground",
      };
  }
}

/*
 * =========================================================
 * Loading
 * =========================================================
 */

function CardPerformanceLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />

        <Skeleton className="h-4 w-64" />
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
            length:
              4,
          }).map(
            (
              _,
              index
            ) => (
              <Skeleton
                key={
                  index
                }
                className="h-24 rounded-xl"
              />
            )
          )}
        </div>

        <Skeleton className="h-48 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}

/*
 * =========================================================
 * Component
 * =========================================================
 */

export function CardPerformance({
  storeId,
  range,
}: CardPerformanceProps) {
  const {
    data,
    isLoading,
    isError,
  } =
    useCardPerformance({ storeId, range });

  /*
   * =======================================================
   * Loading
   * =======================================================
   */

  if (
    isLoading
  ) {
    return (
      <CardPerformanceLoading />
    );
  }

  /*
   * =======================================================
   * Error
   * =======================================================
   */

  if (
    isError ||
    !data
  ) {
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
              Card performance could not be loaded.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Please try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    summary,
    cards,
    period,
  } =
    data;

  const bestCardId =
    summary.bestCard
      ?.id ??
    null;

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
                <CreditCard className="size-4" />
              </div>

              <CardTitle className="text-base">
                Card Performance
              </CardTitle>
            </div>

            <CardDescription>
              See which physical ValYou cards generate the most customer engagement.
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
            {formatPeriod(
              period.from,
              period.to
            )}
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
          {/* Interactions */}

          <div
            className="
              rounded-xl
              border
              border-border/60
              bg-background
              p-4
            "
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <MousePointerClick className="size-4" />

              <span className="text-xs font-medium">
                Interactions
              </span>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {summary.totalInteractions}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Meaningful interactions
            </p>
          </div>

          {/* Unique visitors */}

          <div
            className="
              rounded-xl
              border
              border-border/60
              bg-background
              p-4
            "
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />

              <span className="text-xs font-medium">
                Unique visitors
              </span>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {summary.totalUniqueVisitors}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Across this location
            </p>
          </div>

          {/* Active cards */}

          <div
            className="
              rounded-xl
              border
              border-border/60
              bg-background
              p-4
            "
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="size-4" />

              <span className="text-xs font-medium">
                Active cards
              </span>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {summary.activeCards}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              of {summary.totalCards} cards
            </p>
          </div>

          {/* Needs attention */}

          <div
            className="
              rounded-xl
              border
              border-border/60
              bg-background
              p-4
            "
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="size-4" />

              <span className="text-xs font-medium">
                Needs attention
              </span>
            </div>

            <p
              className={
                summary.cardsNeedingAttention >
                0
                  ? "mt-3 text-2xl font-semibold tracking-tight text-amber-600 dark:text-amber-400"
                  : "mt-3 text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400"
              }
            >
              {summary.cardsNeedingAttention}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Operational status
            </p>
          </div>
        </div>

        {/* =================================================
            Best card
        ================================================= */}

        {summary.bestCard && (
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
                  Top performing card
                </p>

                <p className="mt-0.5 text-sm font-semibold">
                  {getCardName(
                    summary.bestCard
                  )}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-semibold">
                {
                  summary
                    .bestCard
                    .meaningfulInteractions
                }{" "}
                interactions
              </p>

              <p className="text-xs text-muted-foreground">
                {
                  summary
                    .bestCard
                    .uniqueVisitors
                }{" "}
                unique visitors
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            Empty
        ================================================= */}

        {cards?.length ===
        0 ? (
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
            <CreditCard
              className="
                mx-auto
                size-7
                text-muted-foreground/60
              "
            />

            <p className="mt-3 text-sm font-medium">
              No cards assigned
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              No physical ValYou cards are currently assigned to this location.
            </p>
          </div>
        ) : (
          <>
            {/* =============================================
                Desktop Table
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
                    <TableHead className="w-[44px]">
                      #
                    </TableHead>

                    <TableHead>
                      Card
                    </TableHead>

                    <TableHead className="text-right">
                      Interactions
                    </TableHead>

                    <TableHead className="text-right">
                      Visitors
                    </TableHead>

                    <TableHead className="text-right">
                      Share
                    </TableHead>

                    <TableHead>
                      Last activity
                    </TableHead>

                    <TableHead className="text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {cards?.map(
                    (
                      card,
                      index
                    ) => {
                      const activity =
                        getActivityStatus(
                          card.activityStatus
                        );

                      const isBest =
                        card.id ===
                        bestCardId;

                      return (
                        <TableRow
                          key={
                            card.id
                          }
                          className={
                            isBest
                              ? "bg-emerald-50/40 dark:bg-emerald-950/10"
                              : undefined
                          }
                        >
                          <TableCell className="font-medium">
                            {index +
                              1}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              {isBest && (
                                <Trophy
                                  className="
                                    size-3.5
                                    shrink-0
                                    text-emerald-600

                                    dark:text-emerald-400
                                  "
                                />
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                  {getCardName(
                                    card
                                  )}
                                </p>

                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  Ref:{" "}
                                  {card.code.slice(
                                    0,
                                    8
                                  )}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <p className="font-medium">
                              {
                                card.meaningfulInteractions
                              }
                            </p>

                            {card.duplicateTaps >
                              0 && (
                              <p className="text-[11px] text-muted-foreground">
                                {
                                  card.duplicateTaps
                                }{" "}
                                duplicates excluded
                              </p>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            {
                              card.uniqueVisitors
                            }
                          </TableCell>

                          <TableCell className="text-right">
                            {
                              card.sharePercentage
                            }
                            %
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {formatLastActivity(
                              card.lastInteractionAt
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Badge
                                variant="outline"
                                className={
                                  activity.className
                                }
                              >
                                {
                                  activity.label
                                }
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </div>

            {/* =============================================
                Mobile
            ============================================= */}

            <div className="space-y-3 md:hidden">
              {cards?.map(
                (
                  card,
                  index
                ) => {
                  const activity =
                    getActivityStatus(
                      card.activityStatus
                    );

                  const isBest =
                    card.id ===
                    bestCardId;

                  return (
                    <div
                      key={
                        card.id
                      }
                      className={
                        isBest
                          ? "rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/10"
                          : "rounded-xl border border-border/60 p-4"
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              #
                              {index +
                                1}
                            </span>

                            {isBest && (
                              <Trophy className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>

                          <p className="mt-1 truncate text-sm font-semibold">
                            {getCardName(
                              card
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Ref:{" "}
                            {card.code.slice(
                              0,
                              8
                            )}
                          </p>
                        </div>

                        <Badge
                          variant="outline"
                          className={
                            activity.className
                          }
                        >
                          {
                            activity.label
                          }
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Interactions
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {
                              card.meaningfulInteractions
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Visitors
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {
                              card.uniqueVisitors
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Share
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {
                              card.sharePercentage
                            }
                            %
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">
                        Last activity:{" "}
                        {formatLastActivity(
                          card.lastInteractionAt
                        )}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}