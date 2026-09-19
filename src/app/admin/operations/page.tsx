"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Gauge,
  Mail,
  RefreshCw,
  ServerCog,
  Workflow,
  XCircle,
} from "lucide-react";

import { format, parseISO } from "date-fns";

import { useOperationalHealth } from "@/hooks/admin/operations/use-operational-health";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";

import { Skeleton } from "@/components/ui/skeleton";

import type { OperationalStatus, QueueHealth } from "@/types/operations";
import { getApiErrorRequestId } from "@/lib/api-error";

export default function AdminOperationsPage() {
  const { data, error, isLoading, isError, isFetching, refetch } =
    useOperationalHealth();
  if (isLoading) {
    return <OperationsSkeleton />;
  }

  const requestId = getApiErrorRequestId(error);

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto size-9 text-destructive" />
          {requestId && (
            <p className="mt-3 text-xs text-muted-foreground">
              Reference: <span className="font-mono">{requestId}</span>
            </p>
          )}
          <h1 className="mt-4 text-xl font-semibold">
            Unable to load system health
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            ValYou could not retrieve the operational health snapshot.
          </p>

          <Button variant="outline" className="mt-5" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Platform operations
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              System Health
            </h1>

            <HealthBadge status={data.status} />
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Monitor infrastructure, queues, email delivery, weekly reports and
            Google API usage.
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Updated {format(parseISO(data.generatedAt), "MMM d, HH:mm:ss")}
          </p>
        </div>

        <Button
          variant="outline"
          disabled={isFetching}
          onClick={() => refetch()}
        >
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Overall health */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <HealthCard
          title="Redis"
          healthy={data.dependencies.redis.available}
          icon={Database}
          healthyText="Connected"
          unhealthyText="Unavailable"
        />

        <HealthCard
          title="Background worker"
          healthy={data.dependencies.worker.available}
          icon={ServerCog}
          healthyText="Running"
          unhealthyText="Worker heartbeat missing"
        />

        <HealthCard
          title="Weekly queue"
          healthy={
            data.queues.weeklyReports.available &&
            (data.queues.weeklyReports.failed ?? 0) === 0
          }
          icon={Workflow}
          healthyText="Operational"
          unhealthyText="Needs attention"
        />

        <HealthCard
          title="Reminder queue"
          healthy={
            data.queues.subscriptionReminders.available &&
            (data.queues.subscriptionReminders.failed ?? 0) === 0
          }
          icon={Activity}
          healthyText="Operational"
          unhealthyText="Needs attention"
        />

        <HealthCard
          title="Email delivery"
          healthy={data.email.unknown === 0 && data.email.staleProcessing === 0}
          icon={Mail}
          healthyText="Healthy"
          unhealthyText="Manual review required"
        />
      </div>

      {/* Issues */}
      <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Operational issues</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Conditions currently requiring attention.
            </p>
          </div>

          <Badge variant={data.issues.length > 0 ? "destructive" : "outline"}>
            {data.issues.length} issues
          </Badge>
        </div>

        {data.issues.length === 0 ? (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />

            <div>
              <p className="text-sm font-medium">Everything looks healthy</p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                No operational issues currently require attention.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {data.issues.map((issue, index) => (
              <div
                key={`${issue.code}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-border/70 p-4"
              >
                {issue.severity === "CRITICAL" ? (
                  <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                ) : (
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{issue.message}</p>

                    <Badge
                      variant={
                        issue.severity === "CRITICAL"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {issue.severity}
                    </Badge>
                  </div>

                  <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                    {issue.code}
                  </p>
                </div>

                {issue.value !== undefined && (
                  <span className="font-mono text-sm font-semibold">
                    {issue.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Queues */}
      <div className="grid gap-4 xl:grid-cols-2">
        <QueueCard
          title="Weekly reports"
          description="Report generation and email delivery jobs."
          queue={data.queues.weeklyReports}
        />

        <QueueCard
          title="Subscription reminders"
          description="Upcoming subscription expiration emails."
          queue={data.queues.subscriptionReminders}
        />
      </div>

      {/* Durable state */}
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-2">
            <ServerCog className="size-5" />

            <h2 className="font-semibold">Weekly report deliveries</h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MiniStat label="Pending" value={data.weeklyReports.pending} />

            <MiniStat
              label="Processing"
              value={data.weeklyReports.processing}
            />

            <MiniStat
              label="Failed"
              value={data.weeklyReports.failed}
              dangerous={data.weeklyReports.failed > 0}
            />

            <MiniStat
              label="Stale pending"
              value={data.weeklyReports.stalePending}
              dangerous={data.weeklyReports.stalePending > 0}
            />

            <MiniStat
              label="Stale processing"
              value={data.weeklyReports.staleProcessing}
              dangerous={data.weeklyReports.staleProcessing > 0}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-2">
            <Mail className="size-5" />

            <h2 className="font-semibold">Email dispatch</h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MiniStat label="Processing" value={data.email.processing} />

            <MiniStat
              label="Unknown"
              value={data.email.unknown}
              dangerous={data.email.unknown > 0}
            />

            <MiniStat
              label="Stale processing"
              value={data.email.staleProcessing}
              dangerous={data.email.staleProcessing > 0}
            />
          </div>
        </section>
      </div>

      {/* Google quota */}
      <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
            <Gauge className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">Google API daily budget</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Shared Places API request budget for the ValYou deployment.
            </p>
          </div>
        </div>

        {data.google.budget ? (
          <div className="mt-6">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold tracking-tight">
                  {data.google.budget.percentage}%
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {data.google.budget.used} of {data.google.budget.limit}{" "}
                  requests consumed
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                {data.google.budget.remaining} remaining
              </p>
            </div>

            <Progress value={data.google.budget.percentage} />

            {data.google.budget.resetInSeconds !== null && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock3 className="size-3.5" />
                Resets in approximately{" "}
                {formatDuration(data.google.budget.resetInSeconds)}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Google budget data is currently unavailable.
          </p>
        )}
      </section>
    </div>
  );
}

function HealthBadge({ status }: { status: OperationalStatus }) {
  if (status === "CRITICAL") {
    return <Badge variant="destructive">Critical</Badge>;
  }

  if (status === "WARNING") {
    return (
      <Badge
        variant="outline"
        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
      >
        Warning
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    >
      Healthy
    </Badge>
  );
}

function HealthCard({
  title,
  healthy,
  icon: Icon,
  healthyText,
  unhealthyText,
}: {
  title: string;

  healthy: boolean;

  icon: React.ElementType;

  healthyText: string;

  unhealthyText: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className={`flex size-10 items-center justify-center rounded-xl ${
            healthy ? "bg-emerald-500/10" : "bg-red-500/10"
          }`}
        >
          <Icon
            className={`size-5 ${
              healthy
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive"
            }`}
          />
        </div>

        {healthy ? (
          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertTriangle className="size-4 text-destructive" />
        )}
      </div>

      <p className="mt-5 font-medium">{title}</p>

      <p className="mt-1 text-xs text-muted-foreground">
        {healthy ? healthyText : unhealthyText}
      </p>
    </div>
  );
}

function QueueCard({
  title,
  description,
  queue,
}: {
  title: string;

  description: string;

  queue: QueueHealth;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">{title}</h2>

          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <Badge variant={queue.available ? "outline" : "destructive"}>
          {queue.available ? "Available" : "Unavailable"}
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Waiting" value={queue.waiting ?? 0} />

        <MiniStat label="Active" value={queue.active ?? 0} />

        <MiniStat label="Delayed" value={queue.delayed ?? 0} />

        <MiniStat
          label="Failed"
          value={queue.failed ?? 0}
          dangerous={(queue.failed ?? 0) > 0}
        />
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  dangerous = false,
}: {
  label: string;

  value: number;

  dangerous?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        dangerous
          ? "border-red-500/20 bg-red-500/[0.04]"
          : "border-border/60 bg-muted/20"
      }`}
    >
      <p
        className={`text-2xl font-semibold tracking-tight ${
          dangerous ? "text-destructive" : ""
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function OperationsSkeleton() {
  return (
    <div className="space-y-7">
      <div>
        <Skeleton className="h-10 w-60" />

        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-56 rounded-2xl" />

      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-56 rounded-2xl" />

        <Skeleton className="h-56 rounded-2xl" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-52 rounded-2xl" />

        <Skeleton className="h-52 rounded-2xl" />
      </div>
    </div>
  );
}
