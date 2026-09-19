"use client";

import Link from "next/link";

import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Clock3,
  CreditCard,
  MousePointerClick,
  RefreshCw,
  ShieldAlert,
  UsersRound,
} from "lucide-react";

import {
  format,
  parseISO,
} from "date-fns";

import {
  useAdminOverview,
} from "@/hooks/admin/overview/use-overview";

import {
  PlatformActivityChart,
} from "@/components/admin/overview/platform-activity-chart";

import {
  CustomerStatusBadge,
} from "@/components/admin/customers/customer-status-badge";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";

import {
  Skeleton,
} from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } =
    useAdminOverview();

  if (isLoading) {
    return (
      <AdminDashboardSkeleton />
    );
  }

  if (
    isError ||
    !data
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <AlertTriangle className="mx-auto size-8 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">
            Unable to load overview
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong
            while loading platform
            information.
          </p>

          <Button
            variant="outline"
            className="mt-5"
            onClick={() =>
              refetch()
            }
          >
            <RefreshCw className="size-4" />

            Try again
          </Button>
        </div>
      </div>
    );
  }

  const attentionTotal =
    data.attention
      .pendingActivations +
    data.attention
      .expiredSubscriptions +
    data.attention
      .paymentIssues +
    data.attention
      .noSubscription
      .count +
    data.attention
      .expiringSoon
      .count;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            ValYou operations
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Monitor customers,
            subscriptions,
            physical cards and
            platform engagement
            from one place.
          </p>
        </div>

        {attentionTotal >
          0 && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-2.5 text-sm">
            <ShieldAlert className="size-4 text-amber-500" />

            <span>
              <strong>
                {
                  attentionTotal
                }
              </strong>{" "}
              items need attention
            </span>
          </div>
        )}
      </div>

      {/* Main metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewMetric
          title="Customers"
          value={
            data.customers
              .total
          }
          icon={
            UsersRound
          }
          description={`${data.customers.active} active`}
          href="/admin/customers"
        />

        <OverviewMetric
          title="Businesses"
          value={
            data.businesses
              .total
          }
          icon={
            Building2
          }
          description="Managed workspaces"
          href="/admin/customers"
        />

        <OverviewMetric
          title="7-day interactions"
          value={
            data.activity
              .last7Days
          }
          icon={
            MousePointerClick
          }
          description={
            data.activity
              .percentageChange ===
            null
              ? `${data.activity.today} today`
              : `${data.activity.percentageChange >= 0 ? "+" : ""}${data.activity.percentageChange}% vs previous 7 days`
          }
        />

        <OverviewMetric
          title="Ready cards"
          value={
            data.cards.ready
          }
          icon={
            CreditCard
          }
          description={`${data.cards.active} currently active`}
          href="/admin/cards"
        />
      </div>

      {/* Activity + attention */}
      <div className="grid gap-4 xl:grid-cols-[1.5fr_.8fr]">
        {/* Activity */}
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-semibold">
                Platform activity
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Customer NFC and QR
                interactions across
                all ValYou
                businesses.
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-semibold tracking-tight">
                {
                  data.activity
                    .today
                }
              </p>

              <p className="text-xs text-muted-foreground">
                today
              </p>
            </div>
          </div>

          <PlatformActivityChart
            data={
              data.activity
                .timeline
            }
          />
        </section>

        {/* Needs attention */}
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-500" />

            <h2 className="font-semibold">
              Needs attention
            </h2>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Operational items
            worth reviewing.
          </p>

          <div className="mt-6 space-y-3">
            <AttentionRow
              title="Pending activations"
              value={
                data.attention
                  .pendingActivations
              }
              description="Customers that haven't activated their account"
              href="/admin/customers"
            />

            <AttentionRow
              title="Expiring soon"
              value={
                data.attention
                  .expiringSoon
                  .count
              }
              description="Subscriptions expiring within 7 days"
             href="/admin/subscriptions?renewals=7"
            />

            <AttentionRow
              title="Expired"
              value={
                data.attention
                  .expiredSubscriptions
              }
              description="Businesses with expired access"
              href="/admin/subscriptions"
            />

            <AttentionRow
              title="Past due"
              value={
                data.attention
                  .paymentIssues
              }
              description="Subscriptions requiring payment follow-up"
              href="/admin/subscriptions"
            />

            <AttentionRow
              title="No subscription"
              value={
                data.attention
                  .noSubscription
                  .count
              }
              description="Business workspaces with no active plan"
              href="/admin/subscriptions"
            />
          </div>
        </section>
      </div>

      {/* Subscription health + Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
          <SectionHeader
            title="Subscription health"
            description="Current status across business workspaces."
            href="/admin/subscriptions"
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MiniStat
              label="Active"
              value={
                data
                  .subscriptions
                  .active
              }
            />

            <MiniStat
              label="Trial"
              value={
                data
                  .subscriptions
                  .trial
              }
            />

            <MiniStat
              label="Past due"
              value={
                data
                  .subscriptions
                  .pastDue
              }
            />

            <MiniStat
              label="Expired"
              value={
                data
                  .subscriptions
                  .expired
              }
            />

            <MiniStat
              label="Canceled"
              value={
                data
                  .subscriptions
                  .canceled
              }
            />

            <MiniStat
              label="No plan"
              value={
                data
                  .subscriptions
                  .noSubscription
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
          <SectionHeader
            title="Card inventory"
            description="Physical ValYou card availability and deployment."
            href="/admin/cards"
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat
              label="Total"
              value={
                data.cards.total
              }
            />

            <MiniStat
              label="Ready"
              value={
                data.cards.ready
              }
            />

            <MiniStat
              label="Active"
              value={
                data.cards.active
              }
            />

            <MiniStat
              label="Inactive"
              value={
                data.cards
                  .inactive
              }
            />
          </div>

          {data.cards.ready <=
            5 && (
            <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">
                Low inventory:
              </strong>{" "}
              only{" "}
              {data.cards.ready}{" "}
              ready cards are
              currently available
              for new customers.
            </div>
          )}
        </section>
      </div>

      {/* Recent customers */}
      <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:p-6">
        <SectionHeader
          title="Recent customers"
          description="Newest accounts created in ValYou."
          href="/admin/customers"
        />

        <div className="mt-5 divide-y divide-border/60">
          {data.recentCustomers.length ===
          0 ? (
            <div className="py-10 text-center">
              <UsersRound className="mx-auto size-7 text-muted-foreground/50" />

              <p className="mt-3 text-sm text-muted-foreground">
                No customers yet.
              </p>
            </div>
          ) : (
            data.recentCustomers.map(
              (
                customer
              ) => (
                <Link
                  key={
                    customer.id
                  }
                  href={`/admin/customers/${customer.id}`}
                  className="flex flex-col gap-3 py-4 transition hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400">
                      {customer.name
                        .charAt(
                          0
                        )
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {
                          customer.name
                        }
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {
                          customer.email
                        }
                      </p>

                      {customer
                        .businesses
                        .length >
                        0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {customer.businesses
                            .map(
                              (
                                business
                              ) =>
                                business.name
                            )
                            .join(
                              ", "
                            )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CustomerStatusBadge
                      status={
                        customer.status
                      }
                    />

                    <span className="text-xs text-muted-foreground">
                      {format(
                        parseISO(
                          customer.createdAt
                        ),
                        "MMM d"
                      )}
                    </span>

                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              )
            )
          )}
        </div>
      </section>

      {/* Expiring soon */}
      {data.attention
        .expiringSoon
        .businesses.length >
        0 && (
        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5 md:p-6">
          <div className="flex items-center gap-2">
            <Clock3 className="size-5 text-amber-500" />

            <div>
              <h2 className="font-semibold">
                Expiring soon
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Follow up before
                these subscriptions
                lose access.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.attention.expiringSoon.businesses.map(
              (
                item
              ) => (
                <Link
                  key={
                    item.businessId
                  }
                  href={`/admin/customers/${item.customerId}`}
                  className="rounded-xl border border-border/70 bg-card p-4 transition hover:border-emerald-500/30"
                >
                  <p className="font-medium">
                    {
                      item.businessName
                    }
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {
                      item.customerName
                    }
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {item.plan}{" "}
                      /{" "}
                      {item.status}
                    </span>

                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      {format(
                        parseISO(
                          item.expiresAt
                        ),
                        "MMM d"
                      )}
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function OverviewMetric({
  title,
  value,
  icon: Icon,
  description,
  href,
}: {
  title: string;

  value: number;

  icon:
    React.ElementType;

  description: string;

  href?: string;
}) {
  const content = (
    <div className="group rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm transition hover:border-emerald-500/25">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>

        {href && (
          <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-foreground" />
        )}
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-sm font-medium">
        {title}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
}

function AttentionRow({
  title,
  value,
  description,
  href,
}: {
  title: string;

  value: number;

  description: string;

  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-border/60 p-3 transition hover:bg-muted/40"
    >
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
          value > 0
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        }`}
      >
        {value}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowUpRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function SectionHeader({
  title,
  description,
  href,
}: {
  title: string;

  description: string;

  href: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className={buttonVariants({
          variant:
            "ghost",

          size:
            "sm",
        })}
      >
        View all

        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
      <p className="text-2xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-7">
      <div>
        <Skeleton className="h-10 w-52" />

        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map(
          (_, index) => (
            <Skeleton
              key={
                index
              }
              className="h-40 rounded-2xl"
            />
          )
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_.8fr]">
        <Skeleton className="h-[390px] rounded-2xl" />

        <Skeleton className="h-[390px] rounded-2xl" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl" />

        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}