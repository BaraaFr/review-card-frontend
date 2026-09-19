"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CircleCheck,
  Clock3,
  Crown,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
  WalletCards,
  X,
} from "lucide-react";

import { format, parseISO } from "date-fns";

import type {
  AdminSubscriptionFilterStatus,
  AdminSubscriptionRecord,
} from "@/types/admin-subscription";

import type { SubscriptionPlan } from "@/types/subscription";

import {
  useAdminSubscriptions,
  adminSubscriptionKeys,
} from "@/hooks/admin/subscriptions/use-admin-subscriptions";

import { BusinessSubscriptionDialog } from "@/components/admin/subscriptions/business-subscription-dialog";

import { SubscriptionStatCard } from "@/components/admin/subscriptions/subscription-stat-card";

import { SubscriptionStatusBadge } from "@/components/subscriptions/subscription-status";

import { CustomerStatusBadge } from "@/components/admin/customers/customer-status-badge";

import { RefreshButton } from "@/components/common/refresh-button";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RenewalDesk } from "@/components/admin/subscriptions/renewal-desk";

type EffectiveStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED"
  | "NO_SUBSCRIPTION";

type SelectedBusiness = {
  id: string;
  name: string;
};

/* =========================================================
 * PAGE
 * ========================================================= */

export default function AdminSubscriptionsPage() {
  const {
    data: records = [],
    isLoading,
    isError,
    refetch,
  } = useAdminSubscriptions();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<AdminSubscriptionFilterStatus>("");

  const [plan, setPlan] = useState<"" | SubscriptionPlan>("");

  const [selectedBusiness, setSelectedBusiness] =
    useState<SelectedBusiness | null>(null);

  /* =======================================================
   * STATS
   * ======================================================= */

  const stats = useMemo(() => {
    let active = 0;
    let trials = 0;
    let attention = 0;
    let none = 0;

    records.forEach((record) => {
      const current = getEffectiveStatus(record);

      if (current === "ACTIVE") {
        active++;
      }

      if (current === "TRIAL") {
        trials++;
      }

      if (
        current === "PAST_DUE" ||
        current === "CANCELED" ||
        current === "EXPIRED"
      ) {
        attention++;
      }

      if (current === "NO_SUBSCRIPTION") {
        none++;
      }
    });

    return {
      total: records.length,
      active,
      trials,
      attention,
      none,
    };
  }, [records]);

  /* =======================================================
   * FILTERS
   * ======================================================= */

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return records.filter((record) => {
      const currentStatus = getEffectiveStatus(record);

      if (status && currentStatus !== status) {
        return false;
      }

      if (plan && record.subscription?.plan !== plan) {
        return false;
      }

      if (normalizedSearch) {
        const searchable = [
          record.customer.name,
          record.customer.email,
          record.business.name,
          record.subscription?.plan ?? "",
          currentStatus,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(normalizedSearch)) {
          return false;
        }
      }

      return true;
    });
  }, [records, search, status, plan]);

  const hasFilters = Boolean(search.trim()) || Boolean(status) || Boolean(plan);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPlan("");
  };

  const openManage = (record: AdminSubscriptionRecord) => {
    setSelectedBusiness({
      id: record.business.id,
      name: record.business.name,
    });
  };

  return (
    <>
      <div className="min-w-0 w-full max-w-full space-y-6 pb-8 sm:space-y-7">
        {/* =================================================
         * HEADER
         * ================================================= */}

        <header className="min-w-0">
          <div className="flex flex-col gap-5 border-b border-border/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
            {/* Heading */}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 shrink-0 rounded-full bg-emerald-500" />

                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
                  Revenue operations
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Subscriptions
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Monitor subscription access, track workspaces that need
                attention, and manage plans across ValYou.
              </p>
            </div>

            {/* Header action */}

            <div className="flex shrink-0 items-center lg:pb-1">
              <RefreshButton queryKey={adminSubscriptionKeys.all} />
            </div>
          </div>
        </header>

        {/* =================================================
         * STATS
         * ================================================= */}

        <section
          aria-label="Subscription overview"
          className="
            grid
            min-w-0
            grid-cols-2
            gap-3

            sm:gap-4
            lg:grid-cols-3
            xl:grid-cols-5
          "
        >
          <SubscriptionStatCard
            title="Workspaces"
            value={stats.total}
            icon={Building2}
            description="Total businesses"
          />

          <SubscriptionStatCard
            title="Active"
            value={stats.active}
            icon={CircleCheck}
            description="Paid access"
          />

          <SubscriptionStatCard
            title="Trials"
            value={stats.trials}
            icon={Clock3}
            description="Trial access"
          />

          <SubscriptionStatCard
            title="Needs attention"
            value={stats.attention}
            icon={AlertTriangle}
            description="Inactive or past due"
          />

          <div className="col-span-2 lg:col-span-1">
            <SubscriptionStatCard
              title="No subscription"
              value={stats.none}
              icon={WalletCards}
              description="Awaiting activation"
            />
          </div>
        </section>

        {/* =================================================
         * RECORDS PANEL
         * ================================================= */}

        <section className="min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          {/* Panel heading */}

          <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                Business subscriptions
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Browse and manage access for each business workspace.
              </p>
            </div>

            {!isLoading && !isError && (
              <div className="flex shrink-0 items-center">
                <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {filteredRecords.length} of {records.length}
                </span>
              </div>
            )}
          </div>

          {/* =================================================
           * FILTERS
           * ================================================= */}

          <div className="space-y-3 border-b border-border/60 bg-muted/20 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-muted-foreground" />

              <p className="text-sm font-medium">Filters</p>
            </div>

            <div
              className="
                grid
                min-w-0
                grid-cols-1
                gap-3

                md:grid-cols-2

                xl:grid-cols-[minmax(0,1fr)_minmax(0,180px)_minmax(0,160px)]
              "
            >
              {/* Search */}

              <div className="relative min-w-0 md:col-span-2 xl:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search customer, email or business..."
                  aria-label="Search subscriptions"
                  className="h-10 min-w-0 w-full pl-10"
                />
              </div>

              {/* Status */}

              <NativeSelect
                className="w-full min-w-0"
                value={status}
                aria-label="Filter by subscription status"
                onChange={(event) =>
                  setStatus(
                    event.currentTarget.value as AdminSubscriptionFilterStatus
                  )
                }
              >
                <NativeSelectOption value="">All statuses</NativeSelectOption>

                <NativeSelectOption value="ACTIVE">Active</NativeSelectOption>

                <NativeSelectOption value="TRIAL">Trial</NativeSelectOption>

                <NativeSelectOption value="PAST_DUE">
                  Past due
                </NativeSelectOption>

                <NativeSelectOption value="CANCELED">
                  Canceled
                </NativeSelectOption>

                <NativeSelectOption value="EXPIRED">Expired</NativeSelectOption>

                <NativeSelectOption value="NO_SUBSCRIPTION">
                  No subscription
                </NativeSelectOption>
              </NativeSelect>

              {/* Plan */}

              <NativeSelect
                className="w-full min-w-0"
                value={plan}
                aria-label="Filter by subscription plan"
                onChange={(event) =>
                  setPlan(event.currentTarget.value as "" | SubscriptionPlan)
                }
              >
                <NativeSelectOption value="">All plans</NativeSelectOption>

                <NativeSelectOption value="STARTER">Starter</NativeSelectOption>

                <NativeSelectOption value="PRO">Pro</NativeSelectOption>

                <NativeSelectOption value="BUSINESS">
                  Business
                </NativeSelectOption>
              </NativeSelect>
            </div>

            {/* Filter footer */}

            <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {hasFilters
                  ? `Showing ${filteredRecords.length} matching workspaces`
                  : "Showing all business workspaces"}
              </p>

              {hasFilters && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1.5 text-xs"
                  onClick={clearFilters}
                >
                  <X className="size-3.5" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {/* =================================================
           * CONTENT
           * ================================================= */}

          {isLoading ? (
            <SubscriptionsSkeleton />
          ) : isError ? (
            <div className="flex min-h-72 items-center justify-center p-6 text-center">
              <div className="max-w-sm">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10">
                  <AlertTriangle className="size-6 text-destructive" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                  Unable to load subscriptions
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Something went wrong while loading subscription data.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-5"
                  onClick={() => {
                    void refetch();
                  }}
                >
                  <RefreshCw className="size-4" />
                  Try again
                </Button>
              </div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <EmptySubscriptions
              hasFilters={hasFilters}
              onClear={clearFilters}
            />
          ) : (
            <>
              {/* =============================================
               * MOBILE + TABLET CARDS
               * ============================================= */}

              <div className="grid min-w-0 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 xl:hidden">
                {filteredRecords.map((record) => (
                  <SubscriptionMobileCard
                    key={record.business.id}
                    record={record}
                    onManage={() => openManage(record)}
                  />
                ))}
              </div>

              {/* =============================================
               * DESKTOP TABLE
               * ============================================= */}

              <div className="hidden min-w-0 w-full xl:block">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-5">Customer</TableHead>

                      <TableHead>Business</TableHead>

                      <TableHead>Plan</TableHead>

                      <TableHead>Status</TableHead>

                      <TableHead>Locations</TableHead>

                      <TableHead>Expires</TableHead>

                      <TableHead className="w-[100px] pr-5 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredRecords.map((record) => (
                      <SubscriptionRow
                        key={record.business.id}
                        record={record}
                        onManage={() => openManage(record)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {/* Panel footer */}

          {!isLoading && !isError && filteredRecords.length > 0 && (
            <div className="border-t border-border/60 bg-muted/10 px-4 py-3 sm:px-6">
              <p className="text-xs text-muted-foreground">
                Showing {filteredRecords.length}{" "}
                {filteredRecords.length === 1 ? "workspace" : "workspaces"}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* =================================================
       * MANAGE SUBSCRIPTION DIALOG
       * ================================================= */}

      {!isLoading && !isError && (
        <RenewalDesk records={records} onManage={openManage} />
      )}

      {selectedBusiness && (
        <BusinessSubscriptionDialog
          businessId={selectedBusiness.id}
          businessName={selectedBusiness.name}
          open={Boolean(selectedBusiness)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedBusiness(null);
            }
          }}
        />
      )}
    </>
  );
}

/* =========================================================
 * DESKTOP TABLE ROW
 * ========================================================= */

function SubscriptionRow({
  record,
  onManage,
}: {
  record: AdminSubscriptionRecord;
  onManage: () => void;
}) {
  const effectiveStatus = getEffectiveStatus(record);

  return (
    <TableRow className="hover:bg-muted/30">
      {/* Customer */}

      <TableCell className="pl-5">
        <div className="min-w-[140px] max-w-[220px]">
          <Link
            href={`/admin/customers/${record.customer.id}`}
            className="block truncate font-medium transition hover:text-emerald-600 dark:hover:text-emerald-400"
            title={record.customer.name}
          >
            {record.customer.name}
          </Link>

          <p
            className="mt-1 truncate text-xs text-muted-foreground"
            title={record.customer.email}
          >
            {record.customer.email}
          </p>

          <div className="mt-2">
            <CustomerStatusBadge status={record.customer.status} />
          </div>
        </div>
      </TableCell>

      {/* Business */}

      <TableCell>
        <div className="flex min-w-[135px] max-w-[220px] items-center gap-2.5">
          <BusinessAvatar
            name={record.business.name}
            logoUrl={record.business.logoUrl}
          />

          <span
            className="min-w-0 truncate font-medium"
            title={record.business.name}
          >
            {record.business.name}
          </span>
        </div>
      </TableCell>

      {/* Plan */}

      <TableCell>
        {record.subscription ? (
          <span className="inline-flex rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold">
            {record.subscription.plan}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Status */}

      <TableCell>
        <EffectiveStatusBadge status={effectiveStatus} />
      </TableCell>

      {/* Locations */}

      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="size-3.5 text-muted-foreground" />

          {record.locationsCount}
        </div>
      </TableCell>

      {/* Expiry */}

      <TableCell className="text-sm text-muted-foreground">
        {formatExpiry(record.subscription?.expiresAt)}
      </TableCell>

      {/* Action */}

      <TableCell className="pr-5 text-right">
        <Button type="button" size="sm" variant="outline" onClick={onManage}>
          Manage
        </Button>
      </TableCell>
    </TableRow>
  );
}

/* =========================================================
 * MOBILE / TABLET CARD
 * ========================================================= */

function SubscriptionMobileCard({
  record,
  onManage,
}: {
  record: AdminSubscriptionRecord;
  onManage: () => void;
}) {
  const effectiveStatus = getEffectiveStatus(record);

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-background">
      {/* Card header */}

      <div className="flex min-w-0 items-start gap-3 p-4">
        <BusinessAvatar
          name={record.business.name}
          logoUrl={record.business.logoUrl}
        />

        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-base font-semibold"
            title={record.business.name}
          >
            {record.business.name}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {record.subscription?.plan ?? "No plan assigned"}
          </p>
        </div>

        <EffectiveStatusBadge status={effectiveStatus} />
      </div>

      {/* Card content */}

      <div className="min-w-0 flex-1 space-y-4 px-4 pb-4">
        {/* Customer */}

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Customer</p>

          <Link
            href={`/admin/customers/${record.customer.id}`}
            className="mt-1 inline-flex max-w-full items-center gap-1 text-sm font-medium transition hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <span className="truncate">{record.customer.name}</span>

            <ArrowUpRight className="size-3.5 shrink-0" />
          </Link>

          <p className="mt-1 break-all text-xs text-muted-foreground">
            {record.customer.email}
          </p>

          <div className="mt-2">
            <CustomerStatusBadge status={record.customer.status} />
          </div>
        </div>

        {/* Subscription details */}

        <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Locations</p>

            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
              <MapPin className="size-3.5 text-muted-foreground" />

              {record.locationsCount}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Expires</p>

            <p className="mt-1 text-sm font-semibold">
              {formatExpiry(record.subscription?.expiresAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Card footer */}

      <div className="border-t border-border/60 bg-muted/20 p-3">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full"
          onClick={onManage}
        >
          <Crown className="size-4" />
          Manage subscription
        </Button>
      </div>
    </article>
  );
}

/* =========================================================
 * REUSABLE HELPERS
 * ========================================================= */

function BusinessAvatar({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string | null;
}) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-500/10">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="size-full object-cover"
        />
      ) : (
        <Building2 className="size-5 text-emerald-600 dark:text-emerald-400" />
      )}
    </div>
  );
}

function EffectiveStatusBadge({ status }: { status: EffectiveStatus }) {
  if (status === "NO_SUBSCRIPTION") {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
        No subscription
      </span>
    );
  }

  return <SubscriptionStatusBadge status={status} />;
}

function formatExpiry(expiresAt: string | null | undefined) {
  if (!expiresAt) {
    return "—";
  }

  return format(parseISO(expiresAt), "MMM d, yyyy");
}

function getEffectiveStatus(record: AdminSubscriptionRecord): EffectiveStatus {
  const subscription = record.subscription;

  if (!subscription) {
    return "NO_SUBSCRIPTION";
  }

  if (
    subscription.expiresAt &&
    (subscription.status === "ACTIVE" || subscription.status === "TRIAL")
  ) {
    const expiresAt = new Date(subscription.expiresAt);

    if (expiresAt < new Date()) {
      return "EXPIRED";
    }
  }

  return subscription.status;
}

/* =========================================================
 * EMPTY STATE
 * ========================================================= */

function EmptySubscriptions({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-12 text-center">
      <div className="max-w-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted">
          <WalletCards className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-lg font-semibold">
          {hasFilters
            ? "No matching subscriptions"
            : "No business workspaces yet"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {hasFilters
            ? "Try a different search or clear your filters to see all workspaces."
            : "Business workspaces will appear here after they are created."}
        </p>

        {hasFilters && (
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={onClear}
          >
            <X className="size-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
 * SKELETON
 * ========================================================= */

function SubscriptionsSkeleton() {
  return (
    <>
      <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-5 xl:hidden">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-xl" />
        ))}
      </div>

      <div className="hidden space-y-3 p-5 xl:block">
        {Array.from({
          length: 7,
        }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </>
  );
}
