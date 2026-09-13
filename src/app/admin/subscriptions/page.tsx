"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  AlertTriangle,
  Building2,
  CircleCheck,
  Clock3,
  Crown,
  RefreshCw,
  Search,
  WalletCards,
} from "lucide-react";

import {
  format,
  parseISO,
} from "date-fns";

import type {
  AdminSubscriptionFilterStatus,
  AdminSubscriptionRecord,
} from "@/types/admin-subscription";

import type {
  SubscriptionPlan,
} from "@/types/subscription";

import {
  useAdminSubscriptions,
} from "@/hooks/admin/subscriptions/use-admin-subscriptions";

import {
  BusinessSubscriptionDialog,
} from "@/components/admin/subscriptions/business-subscription-dialog";

import {
  SubscriptionStatCard,
} from "@/components/admin/subscriptions/subscription-stat-card";

import {
  SubscriptionStatusBadge,
} from "@/components/subscriptions/subscription-status";

import {
  CustomerStatusBadge,
} from "@/components/admin/customers/customer-status-badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

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

type EffectiveStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED"
  | "NO_SUBSCRIPTION";

export default function AdminSubscriptionsPage() {
  const {
    data: records = [],
    isLoading,
    isError,
    refetch,
  } =
    useAdminSubscriptions();

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState<AdminSubscriptionFilterStatus>(
      ""
    );

  const [
    plan,
    setPlan,
  ] =
    useState<
      "" | SubscriptionPlan
    >("");

  const [
    selectedBusiness,
    setSelectedBusiness,
  ] =
    useState<{
      id: string;
      name: string;
    } | null>(
      null
    );

  const stats =
    useMemo(() => {
      let active = 0;
      let trials = 0;
      let attention = 0;
      let none = 0;

      records.forEach(
        (record) => {
          const current =
            getEffectiveStatus(
              record
            );

          if (
            current ===
            "ACTIVE"
          ) {
            active++;
          }

          if (
            current ===
            "TRIAL"
          ) {
            trials++;
          }

          if (
            current ===
              "PAST_DUE" ||
            current ===
              "CANCELED" ||
            current ===
              "EXPIRED"
          ) {
            attention++;
          }

          if (
            current ===
            "NO_SUBSCRIPTION"
          ) {
            none++;
          }
        }
      );

      return {
        total:
          records.length,

        active,
        trials,
        attention,
        none,
      };
    }, [
      records,
    ]);

  const filteredRecords =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return records.filter(
        (record) => {
          const currentStatus =
            getEffectiveStatus(
              record
            );

          if (
            status &&
            currentStatus !==
              status
          ) {
            return false;
          }

          if (
            plan &&
            record.subscription
              ?.plan !==
              plan
          ) {
            return false;
          }

          if (
            normalizedSearch
          ) {
            const searchable =
              [
                record
                  .customer
                  .name,

                record
                  .customer
                  .email,

                record
                  .business
                  .name,

                record
                  .subscription
                  ?.plan ??
                  "",

                currentStatus,
              ]
                .join(" ")
                .toLowerCase();

            if (
              !searchable.includes(
                normalizedSearch
              )
            ) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      records,
      search,
      status,
      plan,
    ]);

  return (
    <>
      <div className="space-y-7">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Revenue operations
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Subscriptions
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Monitor and manage
            subscription access
            across every ValYou
            business workspace.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SubscriptionStatCard
            title="Workspaces"
            value={
              stats.total
            }
            icon={
              Building2
            }
          />

          <SubscriptionStatCard
            title="Active"
            value={
              stats.active
            }
            icon={
              CircleCheck
            }
          />

          <SubscriptionStatCard
            title="Trials"
            value={
              stats.trials
            }
            icon={
              Clock3
            }
          />

          <SubscriptionStatCard
            title="Needs attention"
            value={
              stats.attention
            }
            icon={
              AlertTriangle
            }
          />

          <SubscriptionStatCard
            title="No subscription"
            value={
              stats.none
            }
            icon={
              WalletCards
            }
          />
        </div>

        {/* Filters */}
        <div className="grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm md:grid-cols-[1fr_200px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event
                    .target
                    .value
                )
              }
              placeholder="Search customer, email or business..."
              className="pl-9"
            />
          </div>

          <NativeSelect
            value={
              status
            }
            onChange={(
              event
            ) =>
              setStatus(
                event
                  .currentTarget
                  .value as
                  AdminSubscriptionFilterStatus
              )
            }
          >
            <NativeSelectOption value="">
              All statuses
            </NativeSelectOption>

            <NativeSelectOption value="ACTIVE">
              Active
            </NativeSelectOption>

            <NativeSelectOption value="TRIAL">
              Trial
            </NativeSelectOption>

            <NativeSelectOption value="PAST_DUE">
              Past due
            </NativeSelectOption>

            <NativeSelectOption value="CANCELED">
              Canceled
            </NativeSelectOption>

            <NativeSelectOption value="EXPIRED">
              Expired
            </NativeSelectOption>

            <NativeSelectOption value="NO_SUBSCRIPTION">
              No subscription
            </NativeSelectOption>
          </NativeSelect>

          <NativeSelect
            value={
              plan
            }
            onChange={(
              event
            ) =>
              setPlan(
                event
                  .currentTarget
                  .value as
                  | ""
                  | SubscriptionPlan
              )
            }
          >
            <NativeSelectOption value="">
              All plans
            </NativeSelectOption>

            <NativeSelectOption value="STARTER">
              Starter
            </NativeSelectOption>

            <NativeSelectOption value="PRO">
              Pro
            </NativeSelectOption>

            <NativeSelectOption value="BUSINESS">
              Business
            </NativeSelectOption>
          </NativeSelect>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm">
          {isLoading ? (
            <SubscriptionsSkeleton />
          ) : isError ? (
            <div className="flex min-h-72 items-center justify-center text-center">
              <div>
                <AlertTriangle className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-4 font-medium">
                  Unable to load subscriptions
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Something went wrong
                  while loading subscription data.
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
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Customer
                    </TableHead>

                    <TableHead>
                      Business
                    </TableHead>

                    <TableHead>
                      Plan
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead>
                      Locations
                    </TableHead>

                    <TableHead>
                      Expires
                    </TableHead>

                    <TableHead className="w-[110px]" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredRecords.length ===
                  0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          7
                        }
                        className="h-56 text-center"
                      >
                        <Crown className="mx-auto size-8 text-muted-foreground/50" />

                        <p className="mt-3 text-sm font-medium">
                          No subscriptions found
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Try adjusting
                          your filters.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map(
                      (record) => (
                        <SubscriptionRow
                          key={
                            record
                              .business
                              .id
                          }
                          record={
                            record
                          }
                          onManage={() =>
                            setSelectedBusiness({
                              id:
                                record
                                  .business
                                  .id,

                              name:
                                record
                                  .business
                                  .name,
                            })
                          }
                        />
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {selectedBusiness && (
        <BusinessSubscriptionDialog
          businessId={
            selectedBusiness.id
          }
          businessName={
            selectedBusiness.name
          }
          open={
            Boolean(
              selectedBusiness
            )
          }
          onOpenChange={(
            open
          ) => {
            if (!open) {
              setSelectedBusiness(
                null
              );
            }
          }}
        />
      )}
    </>
  );
}

function SubscriptionRow({
  record,
  onManage,
}: {
  record:
    AdminSubscriptionRecord;

  onManage:
    () => void;
}) {
  const effectiveStatus =
    getEffectiveStatus(
      record
    );

  return (
    <TableRow>
      {/* Customer */}
      <TableCell>
        <div className="min-w-[180px]">
          <Link
            href={`/admin/customers/${record.customer.id}`}
            className="font-medium transition hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {
              record.customer
                .name
            }
          </Link>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {
              record.customer
                .email
            }
          </p>

          <div className="mt-2">
            <CustomerStatusBadge
              status={
                record
                  .customer
                  .status
              }
            />
          </div>
        </div>
      </TableCell>

      {/* Business */}
      <TableCell>
        <div className="flex min-w-[140px] items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-emerald-500/10">
            {record.business
              .logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  record
                    .business
                    .logoUrl
                }
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <Building2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>

          <span className="font-medium">
            {
              record.business
                .name
            }
          </span>
        </div>
      </TableCell>

      {/* Plan */}
      <TableCell>
        {record.subscription ? (
          <span className="font-medium">
            {
              record
                .subscription
                .plan
            }
          </span>
        ) : (
          <span className="text-muted-foreground">
            —
          </span>
        )}
      </TableCell>

      {/* Status */}
      <TableCell>
        {effectiveStatus ===
        "NO_SUBSCRIPTION" ? (
          <span className="inline-flex rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            No subscription
          </span>
        ) : (
          <SubscriptionStatusBadge
            status={
              effectiveStatus
            }
          />
        )}
      </TableCell>

      {/* Locations */}
      <TableCell>
        {record.locationsCount}
      </TableCell>

      {/* Expiry */}
      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
        {record.subscription
          ?.expiresAt
          ? format(
              parseISO(
                record
                  .subscription
                  .expiresAt
              ),
              "MMM d, yyyy"
            )
          : "—"}
      </TableCell>

      {/* Manage */}
      <TableCell>
        <Button
          size="sm"
          variant="outline"
          onClick={
            onManage
          }
        >
          Manage
        </Button>
      </TableCell>
    </TableRow>
  );
}

function getEffectiveStatus(
  record:
    AdminSubscriptionRecord
): EffectiveStatus {
  const subscription =
    record.subscription;

  if (!subscription) {
    return "NO_SUBSCRIPTION";
  }

  if (
    subscription.expiresAt &&
    (
      subscription.status ===
        "ACTIVE" ||
      subscription.status ===
        "TRIAL"
    )
  ) {
    const expiresAt =
      new Date(
        subscription.expiresAt
      );

    if (
      expiresAt <
      new Date()
    ) {
      return "EXPIRED";
    }
  }

  return subscription.status;
}

function SubscriptionsSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({
        length: 7,
      }).map(
        (_, index) => (
          <Skeleton
            key={
              index
            }
            className="h-16 w-full"
          />
        )
      )}
    </div>
  );
}