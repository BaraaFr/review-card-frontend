"use client";

import { useEffect, useMemo, useState } from "react";

import { Activity, CalendarDays, Clock3, Gauge } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { useEngagementPatterns } from "@/hooks/analytics/use-engagement-patterns";
import { AnalyticsRange } from "@/types/analytics-filter";

type EngagementPatternsProps = {
  storeId: string;
range:AnalyticsRange
};

export function EngagementPatterns({ storeId, range }: EngagementPatternsProps) {
  /*
   * Get the browser's real timezone
   * only after mounting.
   *
   * Example:
   *
   * Asia/Beirut
   */
  const [timeZone, setTimeZone] = useState<string | null>(null);

  useEffect(() => {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;

    setTimeZone(resolved || "UTC");
  }, []);

  const { data, isLoading, isError } = useEngagementPatterns({
    storeId,
    range,
  });

  const maxDailyInteractions = useMemo(
    () =>
      Math.max(...(data?.dailyTrend.map((item) => item.interactions) ?? []), 1),
    [data]
  );

  const maxHourlyInteractions = useMemo(
    () =>
      Math.max(
        ...(data?.hourlyDistribution.map((item) => item.interactions) ?? []),
        1
      ),
    [data]
  );

  if (!timeZone || isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-8 w-52" />

        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>

        <Skeleton className="h-72 rounded-xl" />

        <Skeleton className="h-64 rounded-xl" />
      </section>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Activity className="size-5" />
          </div>

          <p className="mt-4 font-medium">Unable to load engagement patterns</p>

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
          Heading
      ============================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-200/70 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Activity className="size-4" />
            </div>

            <h2 className="text-lg font-semibold tracking-tight">
              Engagement Patterns
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Discover when your customers are most likely to engage.
          </p>
        </div>

      </div>

      {/* =============================================
          Insight cards
      ============================================= */}

      <div className="grid gap-4 md:grid-cols-3">
        {/* Peak day */}

        <InsightCard
          icon={CalendarDays}
          label="Peak day"
          value={data.summary.peakDay?.weekday ?? "No activity"}
          description={
            data.summary.peakDay
              ? `${data.summary.peakDay.interactions} interactions`
              : "Not enough activity yet"
          }
        />

        {/* Peak time */}

        <InsightCard
          icon={Clock3}
          label="Peak time"
          value={data.summary.peakTime?.label ?? "No activity"}
          description={
            data.summary.peakTime
              ? `${data.summary.peakTime.interactions} interactions during this window`
              : "Not enough activity yet"
          }
        />

        {/* Average */}

        <InsightCard
          icon={Gauge}
          label="Daily average"
          value={`${data.summary.averagePerDay}`}
          description="Meaningful interactions per day"
        />
      </div>

      {/* =============================================
          Daily activity trend
      ============================================= */}

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-50/50 via-background to-background px-5 py-4 dark:from-emerald-950/20 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Activity trend</CardTitle>

              {/* <p className="mt-1 text-xs text-muted-foreground">
                Meaningful customer interactions during the last {days} days.
              </p> */}
            </div>

            <div className="text-right">
              <p className="text-xl font-semibold tabular-nums">
                {data.summary.totalInteractions}
              </p>

              <p className="text-xs text-muted-foreground">
                total interactions
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="flex h-52 items-end gap-2 sm:gap-3">
            {data.dailyTrend.map((day) => {
              const height = (day.interactions / maxDailyInteractions) * 100;

              return (
                <div
                  key={day.date}
                  className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                >
                  {/* Value */}

                  <div className="mb-2 text-center">
                    <span className="text-xs font-semibold tabular-nums opacity-0 transition-opacity group-hover:opacity-100">
                      {day.interactions}
                    </span>
                  </div>

                  {/* Bar area */}

                  <div className="flex h-36 items-end justify-center">
                    <div
                      className="w-full max-w-12 rounded-t-lg bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-600 dark:bg-emerald-600 dark:group-hover:bg-emerald-500"
                      style={{
                        height:
                          day.interactions > 0
                            ? `${Math.max(height, 6)}%`
                            : "3px",
                        opacity: day.interactions > 0 ? 1 : 0.2,
                      }}
                    />
                  </div>

                  {/* Label */}

                  <div className="mt-3 text-center">
                    <p className="truncate text-xs font-medium">
                      {day.weekday.slice(0, 3)}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground sm:text-[11px]">
                      {day.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* =============================================
          Hourly activity
      ============================================= */}

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-50/50 via-background to-background px-5 py-4 dark:from-emerald-950/20 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Activity by time</CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                See which hours generate the most customer engagement.
              </p>
            </div>

            {data.summary.peakTime && (
              <Badge
                variant="outline"
                className="shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                Peak {data.summary.peakTime.label}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          {/*
           * Horizontal scrolling is intentional
           * on very small screens.
           */}

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[680px]">
              <div
                className="grid h-36 items-end gap-1.5"
                style={{
                  gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
                }}
              >
                {data.hourlyDistribution.map((item) => {
                  const height =
                    (item.interactions / maxHourlyInteractions) * 100;

                  return (
                    <div
                      key={item.hour}
                      title={`${item.label}: ${item.interactions} interactions`}
                      className="group flex h-full items-end"
                    >
                      <div
                        className="w-full rounded-t-sm bg-emerald-500/70 transition-all duration-300 group-hover:bg-emerald-600 dark:bg-emerald-600/70 dark:group-hover:bg-emerald-500"
                        style={{
                          height:
                            item.interactions > 0
                              ? `${Math.max(height, 5)}%`
                              : "2px",
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Time labels */}

              <div className="mt-3 grid grid-cols-5 text-xs text-muted-foreground">
                <span>12 AM</span>

                <span className="text-center">6 AM</span>

                <span className="text-center">12 PM</span>

                <span className="text-center">6 PM</span>

                <span className="text-right">12 AM</span>
              </div>
            </div>
          </div>

          {data.summary.peakTime && (
            <div className="mt-5 rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <Clock3 className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Your busiest customer window is{" "}
                    {data.summary.peakTime.label}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {data.summary.peakTime.interactions} meaningful interactions
                    happened during this time window in the selected period.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

/*
 * =======================================================
 * Small insight card
 * =======================================================
 */

function InsightCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof CalendarDays;

  label: string;

  value: string;

  description: string;
}) {
  return (
    <Card className="group border-border/60 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-900/70">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>

            <p className="mt-2 truncate text-xl font-semibold tracking-tight">
              {value}
            </p>

            <p className="mt-1.5 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:group-hover:bg-emerald-950/50">
            <Icon className="size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
