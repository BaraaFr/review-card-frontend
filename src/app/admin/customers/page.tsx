"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Clock3,
  Mail,
  MoreHorizontal,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
  X,
} from "lucide-react";

import { format, parseISO } from "date-fns";

import { toast } from "sonner";

import type {
  ActivationResult,
  Customer,
  CustomerCreationResult,
  CustomerStatus,
} from "@/types/customer";

import {
  customerKeys,
  useCustomers,
  useResendActivation,
} from "@/hooks/admin/customers/use-customers";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

import {
  CustomerStatusBadge,
} from "@/components/admin/customers/customer-status-badge";

import {
  SubscriptionStatCard,
} from "@/components/admin/subscriptions/subscription-stat-card";

import {
  CreateCustomerDialog,
} from "@/components/admin/customers/create-customer-dialog";

import {
  ActivationLinkDialog,
} from "@/components/admin/customers/activation-link-dialog";

import {
  CustomerStatusDialog,
} from "@/components/admin/customers/customer-status-dialog";

import {
  RefreshButton,
} from "@/components/common/refresh-button";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/*
 * =========================================================
 * Types
 * =========================================================
 */

type StatusAction =
  | "enable"
  | "disable";

type CustomerActions = {
  resendPending: boolean;

  onResend: (
    customer: Customer
  ) => void;

  onDisable: (
    customer: Customer
  ) => void;

  onEnable: (
    customer: Customer
  ) => void;
};

/*
 * =========================================================
 * Page
 * =========================================================
 */

export default function AdminCustomersPage() {
  const {
    data: customers = [],
    isLoading,
    isError,
    refetch,
  } = useCustomers();

  const resend =
    useResendActivation();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<
    "" | CustomerStatus
  >("");

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    activationResult,
    setActivationResult,
  ] = useState<ActivationResult | null>(
    null
  );

  const [
    activationCustomer,
    setActivationCustomer,
  ] = useState("");

  const [
    statusCustomer,
    setStatusCustomer,
  ] = useState<Customer | null>(
    null
  );

  const [
    statusAction,
    setStatusAction,
  ] = useState<StatusAction | null>(
    null
  );

  /*
   * =======================================================
   * Statistics
   * =======================================================
   */

  const stats = useMemo(() => {
    let active = 0;
    let pending = 0;
    let disabled = 0;

    customers.forEach(
      (customer) => {
        if (
          customer.status ===
          "ACTIVE"
        ) {
          active++;
        }

        if (
          customer.status ===
          "PENDING"
        ) {
          pending++;
        }

        if (
          customer.status ===
          "DISABLED"
        ) {
          disabled++;
        }
      }
    );

    return {
      total:
        customers.length,

      active,
      pending,
      disabled,
    };
  }, [customers]);

  /*
   * =======================================================
   * Search and filtering
   * =======================================================
   */

  const filteredCustomers =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return customers.filter(
        (customer) => {
          if (
            status &&
            customer.status !==
              status
          ) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const businesses =
            customer.businesses
              .map(
                business =>
                  business.name
              )
              .join(" ");

          return [
            customer.name,
            customer.email,
            businesses,
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              normalizedSearch
            );
        }
      );
    }, [
      customers,
      search,
      status,
    ]);

  const hasFilters =
    Boolean(
      search.trim()
    ) ||
    Boolean(status);

  const clearFilters = () => {
    setSearch("");

    setStatus("");
  };

  /*
   * =======================================================
   * Customer actions
   * =======================================================
   */

  const created = (
    result: CustomerCreationResult
  ) => {
    setActivationCustomer(
      result.user.name
    );

    setActivationResult({
      activationUrl:
        result.activationUrl,

      activationExpiresAt:
        result.activationExpiresAt,
    });
  };

  const resendActivation =
    async (
      customer: Customer
    ) => {
      try {
        const result =
          await resend.mutateAsync(
            customer.id
          );

        setActivationCustomer(
          customer.name
        );

        setActivationResult(
          result
        );

        toast.success(
          "New activation link generated"
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to resend activation"
          )
        );
      }
    };

  const openStatusAction = (
    customer: Customer,

    action: StatusAction
  ) => {
    setStatusCustomer(
      customer
    );

    setStatusAction(
      action
    );
  };

  const actions: CustomerActions = {
    resendPending:
      resend.isPending,

    onResend: (
      customer
    ) => {
      void resendActivation(
        customer
      );
    },

    onDisable: (
      customer
    ) => {
      openStatusAction(
        customer,
        "disable"
      );
    },

    onEnable: (
      customer
    ) => {
      openStatusAction(
        customer,
        "enable"
      );
    },
  };

  return (
    <>
      <div className="w-full min-w-0 max-w-full space-y-6 pb-8 sm:space-y-7">

        {/* =================================================
         * Header
         * ================================================= */}

        <header className="min-w-0">
          <div className="flex flex-col gap-5 border-b border-border/60 pb-6 lg:flex-row lg:items-end lg:justify-between">

            {/* Heading */}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 shrink-0 rounded-full bg-emerald-500" />

                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
                  Customer management
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Customers
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Create and manage ValYou accounts,
                control customer access, and
                oversee account activation
                and business workspaces.
              </p>
            </div>

            {/* Actions */}

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto lg:shrink-0 lg:pb-1">

              <RefreshButton
                queryKey={
                  customerKeys.all
                }
              />

              <Button
                type="button"
                className="h-9 flex-1 gap-2 sm:flex-none"
                onClick={() =>
                  setCreateOpen(
                    true
                  )
                }
              >
                <Plus className="size-4" />

                Add customer
              </Button>

            </div>
          </div>
        </header>

        {/* =================================================
         * Statistics
         * ================================================= */}

        <section
          aria-label="Customer overview"
          className="min-w-0"
        >
          {isLoading ? (
            <CustomersStatsLoading />
          ) : !isError ? (
            <div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 2xl:grid-cols-4">

              <SubscriptionStatCard
                title="Customers"
                value={
                  stats.total
                }
                icon={
                  UsersRound
                }
                description="Total accounts"
              />

              <SubscriptionStatCard
                title="Active"
                value={
                  stats.active
                }
                icon={
                  UserRoundCheck
                }
                description="Activated accounts"
              />

              <SubscriptionStatCard
                title="Pending activation"
                value={
                  stats.pending
                }
                icon={
                  Clock3
                }
                description="Awaiting activation"
              />

              <SubscriptionStatCard
                title="Disabled"
                value={
                  stats.disabled
                }
                icon={
                  UserRoundX
                }
                description="Access disabled"
              />

            </div>
          ) : null}
        </section>

        {/* =================================================
         * Customers panel
         * ================================================= */}

        <section className="min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">

          {/* Panel heading */}

          <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                Customer accounts
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Browse accounts and manage
                customer onboarding.
              </p>
            </div>

            {!isLoading &&
              !isError && (
                <div className="flex shrink-0 items-center">
                  <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    {filteredCustomers.length}{" "}
                    of{" "}
                    {customers.length}
                  </span>
                </div>
              )}

          </div>

          {/* =================================================
           * Filters
           * ================================================= */}

          <div className="space-y-3 border-b border-border/60 bg-muted/20 p-4 sm:p-5">

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-muted-foreground" />

              <p className="text-sm font-medium">
                Filters
              </p>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,200px)]">

              {/* Search */}

              <div className="relative min-w-0">

                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search name, email or business..."
                  aria-label="Search customers"
                  className="h-10 w-full min-w-0 pl-10"
                />

              </div>

              {/* Status */}

              <NativeSelect
                className="w-full min-w-0"
                value={status}
                aria-label="Filter customers by status"
                onChange={(
                  event
                ) =>
                  setStatus(
                    event.currentTarget
                      .value as
                      | ""
                      | CustomerStatus
                  )
                }
              >

                <NativeSelectOption value="">
                  All statuses
                </NativeSelectOption>

                <NativeSelectOption value="ACTIVE">
                  Active
                </NativeSelectOption>

                <NativeSelectOption value="PENDING">
                  Pending activation
                </NativeSelectOption>

                <NativeSelectOption value="DISABLED">
                  Disabled
                </NativeSelectOption>

              </NativeSelect>

            </div>

            {/* Filter summary */}

            <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">

              <p className="text-xs text-muted-foreground">
                {hasFilters
                  ? `Showing ${filteredCustomers.length} matching customers`
                  : "Showing all customer accounts"}
              </p>

              {hasFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={
                    clearFilters
                  }
                >
                  <X className="size-3.5" />

                  Clear filters
                </Button>
              )}

            </div>

          </div>

          {/* =================================================
           * Content
           * ================================================= */}

          {isLoading ? (

            <CustomersLoading />

          ) : isError ? (

            <CustomerErrorState
              onRetry={() => {
                void refetch();
              }}
            />

          ) : filteredCustomers.length ===
            0 ? (

            <CustomersEmptyState
              hasFilters={
                hasFilters
              }
              onClear={
                clearFilters
              }
              onCreate={() =>
                setCreateOpen(
                  true
                )
              }
            />

          ) : (

            <>

              {/* =============================================
               * Mobile + tablet cards
               * ============================================= */}

              <div className="grid min-w-0 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 2xl:hidden">

                {filteredCustomers.map(
                  customer => (
                    <CustomerMobileCard
                      key={
                        customer.id
                      }
                      customer={
                        customer
                      }
                      actions={
                        actions
                      }
                    />
                  )
                )}

              </div>

              {/* =============================================
               * Desktop table
               * ============================================= */}

              <div className="hidden min-w-0 w-full 2xl:block">

                <Table className="min-w-[950px]">

                  <TableHeader>

                    <TableRow className="bg-muted/30 hover:bg-muted/30">

                      <TableHead className="pl-5">
                        Customer
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                      <TableHead>
                        Businesses
                      </TableHead>

                      <TableHead>
                        First workspace plan
                      </TableHead>

                      <TableHead>
                        Created
                      </TableHead>

                      <TableHead className="w-[100px] pr-5 text-right">
                        Actions
                      </TableHead>

                    </TableRow>

                  </TableHeader>

                  <TableBody>

                    {filteredCustomers.map(
                      customer => (
                        <CustomerRow
                          key={
                            customer.id
                          }
                          customer={
                            customer
                          }
                          actions={
                            actions
                          }
                        />
                      )
                    )}

                  </TableBody>

                </Table>

              </div>

            </>

          )}

          {/* Panel footer */}

          {!isLoading &&
            !isError &&
            filteredCustomers.length >
              0 && (

              <div className="border-t border-border/60 bg-muted/10 px-4 py-3 sm:px-6">

                <p className="text-xs text-muted-foreground">
                  Showing{" "}
                  {filteredCustomers.length}{" "}
                  {filteredCustomers.length === 1
                    ? "customer"
                    : "customers"}
                </p>

              </div>

            )}

        </section>

      </div>

      {/* ===================================================
       * Dialogs
       * =================================================== */}

      <CreateCustomerDialog
        open={
          createOpen
        }
        onOpenChange={
          setCreateOpen
        }
        onCreated={
          created
        }
      />

      <ActivationLinkDialog
        result={
          activationResult
        }
        customerName={
          activationCustomer
        }
        open={
          Boolean(
            activationResult
          )
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setActivationResult(
              null
            );

            setActivationCustomer(
              ""
            );
          }
        }}
      />

      <CustomerStatusDialog
        customer={
          statusCustomer
        }
        action={
          statusAction
        }
        open={
          Boolean(
            statusCustomer &&
            statusAction
          )
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setStatusCustomer(
              null
            );

            setStatusAction(
              null
            );
          }
        }}
      />

    </>
  );
}

/*
 * =========================================================
 * Desktop table row
 * =========================================================
 */

function CustomerRow({
  customer,
  actions,
}: {
  customer: Customer;

  actions: CustomerActions;
}) {
  const firstBusiness =
    customer.businesses[0];

  const subscription =
    firstBusiness
      ?.subscriptions?.[0];

  return (
    <TableRow className="hover:bg-muted/30">

      {/* Customer */}

      <TableCell className="pl-5">

        <CustomerIdentity
          customer={customer}
        />

      </TableCell>

      {/* Status */}

      <TableCell>

        <CustomerStatusBadge
          status={
            customer.status
          }
        />

      </TableCell>

      {/* Businesses */}

      <TableCell>

        {firstBusiness ? (

          <div className="min-w-[130px] max-w-[220px]">

            <div className="flex min-w-0 items-center gap-2">

              <Building2 className="size-4 shrink-0 text-muted-foreground" />

              <span
                className="min-w-0 truncate text-sm font-medium"
                title={
                  firstBusiness.name
                }
              >
                {firstBusiness.name}
              </span>

            </div>

            {customer.businesses.length >
              1 && (

              <p className="mt-1 text-xs text-muted-foreground">
                +{customer.businesses.length - 1}{" "}
                more{" "}
                {customer.businesses.length - 1 === 1
                  ? "business"
                  : "businesses"}
              </p>

            )}

          </div>

        ) : (

          <span className="text-muted-foreground">
            —
          </span>

        )}

      </TableCell>

      {/* First workspace subscription */}

      <TableCell>

        <div className="min-w-[115px]">

          {subscription ? (

            <>
              <p className="text-sm font-medium">
                {subscription.plan}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {subscription.status}
              </p>
            </>

          ) : (

            <p className="text-xs text-muted-foreground">
              No subscription
            </p>

          )}

        </div>

      </TableCell>

      {/* Created */}

      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">

        {formatCustomerDate(
          customer.createdAt
        )}

      </TableCell>

      {/* Actions */}

      <TableCell className="pr-5 text-right">

        <CustomerActionsMenu
          customer={customer}
          actions={actions}
        />

      </TableCell>

    </TableRow>
  );
}

/*
 * =========================================================
 * Mobile / tablet customer card
 * =========================================================
 */

function CustomerMobileCard({
  customer,
  actions,
}: {
  customer: Customer;

  actions: CustomerActions;
}) {
  const firstBusiness =
    customer.businesses[0];

  const subscription =
    firstBusiness
      ?.subscriptions?.[0];

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-background">

      {/* Card header */}

      <div className="min-w-0 p-4">

        <div className="flex min-w-0 items-start gap-3">

          <CustomerAvatar
            name={
              customer.name
            }
          />

          <div className="min-w-0 flex-1">

            <Link
              href={`/admin/customers/${customer.id}`}
              className="block truncate text-base font-semibold transition hover:text-emerald-600 dark:hover:text-emerald-400"
              title={
                customer.name
              }
            >
              {customer.name}
            </Link>

            <p
              className="mt-1 break-all text-xs text-muted-foreground"
            >
              {customer.email}
            </p>

          </div>

        </div>

        <div className="mt-3">

          <CustomerStatusBadge
            status={
              customer.status
            }
          />

        </div>

      </div>

      {/* Card body */}

      <div className="min-w-0 flex-1 space-y-4 px-4 pb-4">

        <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4">

          {/* Business count */}

          <div className="min-w-0">

            <p className="text-xs text-muted-foreground">
              Businesses
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">

              <Building2 className="size-4 text-muted-foreground" />

              {customer.businesses.length}

            </p>

          </div>

          {/* Created */}

          <div className="min-w-0">

            <p className="text-xs text-muted-foreground">
              Created
            </p>

            <p className="mt-1 text-sm font-semibold">
              {formatCustomerDate(
                customer.createdAt
              )}
            </p>

          </div>

        </div>

        {/* First business */}

        {firstBusiness && (

          <div className="min-w-0">

            <p className="text-xs text-muted-foreground">
              First business
            </p>

            <p
              className="mt-1 truncate text-sm font-medium"
              title={
                firstBusiness.name
              }
            >
              {firstBusiness.name}
            </p>

            {customer.businesses.length >
              1 && (

              <p className="mt-1 text-xs text-muted-foreground">
                +{customer.businesses.length - 1}{" "}
                more workspaces
              </p>

            )}

          </div>

        )}

        {/* Subscription */}

        <div className="min-w-0">

          <p className="text-xs text-muted-foreground">
            First workspace plan
          </p>

          <p className="mt-1 text-sm font-medium">

            {subscription
              ? `${subscription.plan} · ${subscription.status}`
              : "No subscription"}

          </p>

        </div>

        {/* Email shortcut */}

        <a
          href={`mailto:${customer.email}`}
          className="flex min-w-0 items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
        >

          <Mail className="size-4 shrink-0" />

          <span className="min-w-0 truncate">
            Send email
          </span>

        </a>

      </div>

      {/* Card footer */}

      <div className="border-t border-border/60 bg-muted/20 p-3">

        <div className="flex min-w-0 items-center gap-2">

          <Button
            type="button"
            variant="outline"
            nativeButton={false}
            className="h-10 min-w-0 flex-1"
            render={
              <Link
                href={`/admin/customers/${customer.id}`}
              />
            }
          >
            View customer

            <ArrowUpRight className="size-4" />
          </Button>

          <CustomerActionsMenu
            customer={customer}
            actions={actions}
          />

        </div>

      </div>

    </article>
  );
}

/*
 * =========================================================
 * Customer identity
 * =========================================================
 */

function CustomerIdentity({
  customer,
}: {
  customer: Customer;
}) {
  return (
    <div className="flex min-w-[145px] max-w-[240px] items-center gap-3">

      <CustomerAvatar
        name={
          customer.name
        }
      />

      <div className="min-w-0 flex-1">

        <Link
          href={`/admin/customers/${customer.id}`}
          className="block truncate font-medium transition hover:text-emerald-600 dark:hover:text-emerald-400"
          title={
            customer.name
          }
        >
          {customer.name}
        </Link>

        <p
          className="mt-1 truncate text-xs text-muted-foreground"
          title={
            customer.email
          }
        >
          {customer.email}
        </p>

      </div>

    </div>
  );
}

/*
 * =========================================================
 * Avatar
 * =========================================================
 */

function CustomerAvatar({
  name,
}: {
  name: string;
}) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-semibold text-emerald-600 dark:text-emerald-400">

      {name
        .charAt(0)
        .toUpperCase()}

    </div>
  );
}

/*
 * =========================================================
 * Shared actions menu
 * =========================================================
 */

function CustomerActionsMenu({
  customer,
  actions,
}: {
  customer: Customer;

  actions: CustomerActions;
}) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Actions for ${customer.name}`}
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuGroup>

          {customer.status ===
            "PENDING" && (

            <DropdownMenuItem
              disabled={
                actions.resendPending
              }
              onClick={() =>
                actions.onResend(
                  customer
                )
              }
            >

              <RefreshCw className="size-4" />

              Generate new activation link

            </DropdownMenuItem>

          )}

          {customer.status ===
            "ACTIVE" && (

            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                actions.onDisable(
                  customer
                )
              }
            >

              <PowerOff className="size-4" />

              Disable customer

            </DropdownMenuItem>

          )}

          {customer.status ===
            "DISABLED" && (

            <DropdownMenuItem
              onClick={() =>
                actions.onEnable(
                  customer
                )
              }
            >

              <Power className="size-4" />

              Enable customer

            </DropdownMenuItem>

          )}

        </DropdownMenuGroup>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}

/*
 * =========================================================
 * Error state
 * =========================================================
 */

function CustomerErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-72 items-center justify-center p-6 text-center">

      <div className="max-w-sm">

        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10">

          <AlertTriangle className="size-6 text-destructive" />

        </div>

        <h3 className="mt-4 text-lg font-semibold">
          Unable to load customers
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Something went wrong while loading
          customer accounts.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={
            onRetry
          }
        >

          <RefreshCw className="size-4" />

          Try again

        </Button>

      </div>

    </div>
  );
}

/*
 * =========================================================
 * Empty state
 * =========================================================
 */

function CustomersEmptyState({
  hasFilters,
  onClear,
  onCreate,
}: {
  hasFilters: boolean;

  onClear: () => void;

  onCreate: () => void;
}) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-12 text-center">

      <div className="max-w-sm">

        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted">

          <UsersRound className="size-6 text-muted-foreground" />

        </div>

        <h3 className="mt-4 text-lg font-semibold">

          {hasFilters
            ? "No matching customers"
            : "No customer accounts yet"}

        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">

          {hasFilters
            ? "Try another search or clear your filters."
            : "Create your first ValYou customer to start setting up business workspaces."}

        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={
            hasFilters
              ? onClear
              : onCreate
          }
        >

          {hasFilters ? (
            <X className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}

          {hasFilters
            ? "Clear filters"
            : "Add customer"}

        </Button>

      </div>

    </div>
  );
}

/*
 * =========================================================
 * Loading statistics
 * =========================================================
 */

function CustomersStatsLoading() {
  return (
    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 2xl:grid-cols-4">

      {Array.from({
        length: 4,
      }).map(
        (_, index) => (

          <Skeleton
            key={index}
            className="h-32 rounded-2xl"
          />

        )
      )}

    </div>
  );
}

/*
 * =========================================================
 * Loading content
 * =========================================================
 */

function CustomersLoading() {
  return (
    <>

      {/* Mobile + tablet */}

      <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-5 2xl:hidden">

        {Array.from({
          length: 4,
        }).map(
          (_, index) => (

          <Skeleton
            key={index}
            className="h-64 rounded-xl"
          />

        )
      )}

      </div>

      {/* Desktop */}

      <div className="hidden space-y-3 p-5 2xl:block">

        {Array.from({
          length: 6,
        }).map(
          (_, index) => (

          <Skeleton
            key={index}
            className="h-16 w-full rounded-lg"
          />

        )
      )}

      </div>

    </>
  );
}

/*
 * =========================================================
 * Date helper
 * =========================================================
 */

function formatCustomerDate(
  value: string
) {
  return format(
    parseISO(value),
    "MMM d, yyyy"
  );
}