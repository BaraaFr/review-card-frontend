"use client";

import { useEffect, useState } from "react";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  Loader2,
  Mail,
  MapPin,
  MousePointerClick,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { useWeeklyReport } from "@/hooks/analytics/use-weekly-report";
import { Button } from "../ui/button";
import { downloadAnalyticsReport } from "@/services/analytics-report.service";

type WeeklyReportPreviewProps = {
  storeId: string;

  onDownload: () => void;

  downloading: boolean;
};

/*
 * =======================================================
 * Helpers
 * =======================================================
 */

function displayName(value: string | null, fallback: string) {
  return value?.trim() || fallback;
}

function ChangeValue({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
        New activity
      </span>
    );
  }

  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <ArrowUpRight className="size-3.5" />
        {value}%
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
        <ArrowDownRight className="size-3.5" />
        {Math.abs(value)}%
      </span>
    );
  }

  return <span className="text-xs text-muted-foreground">No change</span>;
}

/*
 * =======================================================
 * Main component
 * =======================================================
 */

export function WeeklyReportPreview({ storeId, downloading, onDownload }: WeeklyReportPreviewProps) {
  const [timeZone, setTimeZone] = useState<string | null>(null);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  }, []);

  const { data, isLoading, isError } = useWeeklyReport({
    storeId,
    timeZone,
  });

  if (!timeZone || isLoading) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-5 p-6">
          <Skeleton className="h-8 w-52" />

          <Skeleton className="h-24 rounded-xl" />

          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>

          <Skeleton className="h-40 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
          <Mail className="size-6 text-muted-foreground" />

          <p className="mt-3 font-medium">Unable to generate weekly report</p>

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
              <Mail className="size-4" />
            </div>

            <h2 className="text-lg font-semibold tracking-tight">
              Weekly Report
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            A simple summary of your week with ValYou.
          </p>

  
        </div>
        <div className="space-y-1.5">
            <Button
              type="button"
              variant="outline"
              className="h-9 w-full bg-background shadow-sm"
              disabled={downloading}
              onClick={onDownload}
            >
              {downloading ? (
                <Loader2 className="size-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
              ) : (
                <Download className="size-4 text-emerald-600 dark:text-emerald-400" />
              )}
              Download Report
            </Button>
          </div>
      </div>

      {/* =============================================
          Email-style report
      ============================================= */}

      <Card className="overflow-hidden border-border/60 shadow-sm">
        {/* ===========================================
            Email header
        =========================================== */}

        <div className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-emerald-50 via-background to-background px-5 py-6 dark:from-emerald-950/30 sm:px-7">
          <div className="absolute -right-16 -top-16 size-52 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10" />

          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />

                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Your week with ValYou
                  </p>
                </div>

                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                  {displayName(data.store.name, "Your location")}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Here&apos;s how customers engaged during the last 7 days.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {data.period.from} – {data.period.to}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="space-y-6 p-5 sm:p-7">
          {/* ===========================================
              Main performance
          =========================================== */}

          <div className="grid gap-3 sm:grid-cols-3">
            <ReportMetric
              icon={MousePointerClick}
              label="Interactions"
              value={data.overview.interactions.current}
              footer={
                <ChangeValue
                  value={data.overview.interactions.changePercentage}
                />
              }
            />

            <ReportMetric
              icon={Users}
              label="Unique visitors"
              value={data.overview.visitors.unique}
              description={`${data.overview.visitors.new} new visitors`}
            />

            <ReportMetric
              icon={Clock3}
              label="Daily average"
              value={data.patterns.averagePerDay}
              description="interactions per day"
            />
          </div>

          {/* ===========================================
              Patterns
          =========================================== */}

          <div className="grid gap-3 md:grid-cols-2">
            <InfoCard
              icon={CalendarDays}
              label="Busiest day"
              value={data.patterns.peakDay?.weekday ?? "No activity yet"}
              description={
                data.patterns.peakDay
                  ? `${data.patterns.peakDay.interactions} interactions`
                  : "Not enough data"
              }
            />

            <InfoCard
              icon={Clock3}
              label="Busiest time"
              value={data.patterns.peakTime?.label ?? "No activity yet"}
              description={
                data.patterns.peakTime
                  ? `${data.patterns.peakTime.interactions} interactions`
                  : "Not enough data"
              }
            />
          </div>

          {/* ===========================================
              Best performers
          =========================================== */}

          {(data.performance.bestCard || data.performance.bestLocation) && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="size-4 text-emerald-600 dark:text-emerald-400" />

                <h4 className="text-sm font-semibold">Top performers</h4>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {data.performance.bestCard && (
                  <TopPerformerCard
                    icon={CreditCard}
                    label="Best card"
                    name={displayName(
                      data.performance.bestCard.name,
                      "Unnamed card"
                    )}
                    interactions={data.performance.bestCard.interactions}
                  />
                )}

                {data.performance.bestLocation && (
                  <TopPerformerCard
                    icon={MapPin}
                    label="Best location"
                    name={displayName(
                      data.performance.bestLocation.name,
                      "Unnamed location"
                    )}
                    interactions={data.performance.bestLocation.interactions}
                  />
                )}
              </div>
            </div>
          )}

          {/* ===========================================
              Attention
          =========================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {data.health === "HEALTHY" ? (
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                )}

                <h4 className="text-sm font-semibold">
                  {data.health === "HEALTHY"
                    ? "Everything looks healthy"
                    : "Needs your attention"}
                </h4>
              </div>

              {data.attention.total > 0 && (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400"
                >
                  {data.attention.total}{" "}
                  {data.attention.total === 1 ? "issue" : "issues"}
                </Badge>
              )}
            </div>

            {data.attention.items.length > 0 ? (
              <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
                {data.attention.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                      <AlertTriangle className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">{item.title}</p>

                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    No major issues detected
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Your active cards and locations are performing normally.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===========================================
              Email footer
          =========================================== */}

          <div className="border-t border-border/60 pt-5 text-center">
            <p className="text-xs text-muted-foreground">
              This preview is generated from your ValYou customer engagement
              data.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/*
 * =======================================================
 * Report metric
 * =======================================================
 */

function ReportMetric({
  icon: Icon,
  label,
  value,
  description,
  footer,
}: {
  icon: typeof Users;

  label: string;

  value: string | number;

  description?: string;

  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>

          <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}

          {footer && <div className="mt-1">{footer}</div>}
        </div>

        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
          <Icon className="size-4" />
        </div>
      </div>
    </div>
  );
}

/*
 * =======================================================
 * Pattern card
 * =======================================================
 */

function InfoCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Clock3;

  label: string;

  value: string;

  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
        <Icon className="size-4" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-0.5 text-sm font-semibold">{value}</p>

        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

/*
 * =======================================================
 * Top performer card
 * =======================================================
 */

function TopPerformerCard({
  icon: Icon,
  label,
  name,
  interactions,
}: {
  icon: typeof Trophy;

  label: string;

  name: string;

  interactions: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>

          <p className="mt-0.5 truncate text-sm font-semibold">{name}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold tabular-nums">{interactions}</p>

        <p className="text-[11px] text-muted-foreground">interactions</p>
      </div>
    </div>
  );
}
