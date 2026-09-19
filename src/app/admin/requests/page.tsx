"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Inbox,
  Mail,
  Phone,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserCheck,
  X,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/badge";

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
  RefreshButton,
} from "@/components/common/refresh-button";

import {
  SubscriptionStatCard,
} from "@/components/admin/subscriptions/subscription-stat-card";

import {
  ManageAccountRequestDialog,
} from "@/components/admin/account-requests/manage-account-requests-dialog";

import {
  accountRequestKeys,
  useAdminAccountRequests,
} from "@/hooks/account-requests/use-admin-account-requests";

import type {
  AccountRequest,
  AccountRequestStatus,
} from "@/types/account-request";

/*
 * =========================================================
 * Types and options
 * =========================================================
 */

type StatusFilter =
  | "ALL"
  | AccountRequestStatus;

const statusOptions: {
  value: StatusFilter;
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All requests",
  },
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "CONTACTED",
    label: "Contacted",
  },
  {
    value: "QUALIFIED",
    label: "Qualified",
  },
  {
    value: "CONVERTED",
    label: "Converted",
  },
  {
    value: "CLOSED",
    label: "Closed",
  },
];

const PER_PAGE = 20;

/*
 * =========================================================
 * PAGE
 * =========================================================
 */

export default function AdminRequestsPage() {
  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<StatusFilter>(
    "ALL"
  );

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    selectedRequest,
    setSelectedRequest,
  ] =
    useState<AccountRequest | null>(
      null
    );

  /*
   * =======================================================
   * Debounced search
   * =======================================================
   */

  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        setSearch(
          searchInput.trim()
        );

        setPage(1);
      },

      350
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  /*
   * =======================================================
   * Query
   * =======================================================
   */

  const query =
    useAdminAccountRequests({
      page,

      perPage: PER_PAGE,

      search:
        search || undefined,

      status:
        status === "ALL"
          ? undefined
          : status,
    });

  const data = query.data;

  const hasFilters =
    Boolean(searchInput.trim()) ||
    status !== "ALL";

  const clearFilters = () => {
    setSearchInput("");

    setSearch("");

    setStatus("ALL");

    setPage(1);
  };

  const changeStatus = (
    value: StatusFilter
  ) => {
    setStatus(value);

    setPage(1);
  };

  const openManage = (
    request: AccountRequest
  ) => {
    setSelectedRequest(
      request
    );
  };

  const closeManage = (
    open: boolean
  ) => {
    if (!open) {
      setSelectedRequest(null);
    }
  };

  return (
    <>
      <div className="min-w-0 w-full max-w-full space-y-6 pb-8 sm:space-y-7">

        {/* =================================================
         * HEADER
         * ================================================= */}

        <header className="min-w-0">

          <div className="flex flex-col gap-5 border-b border-border/60 pb-6 lg:flex-row lg:items-end lg:justify-between">

            {/* Title */}

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-2">

                <div className="h-5 w-1 shrink-0 rounded-full bg-emerald-500" />

                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
                  Customer acquisition
                </p>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Account requests
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Review incoming business requests,
                follow up with potential customers,
                and track their progress toward
                joining ValYou.
              </p>

            </div>

            {/* Header action */}

            <div className="flex shrink-0 items-center lg:pb-1">

              <RefreshButton
                queryKey={
                  accountRequestKeys.all
                }
              />

            </div>

          </div>

        </header>

        {/* =================================================
         * STATISTICS
         * ================================================= */}

        <section
          aria-label="Account request overview"
          className="min-w-0"
        >

          {query.isLoading ? (

            <RequestStatsLoading />

          ) : (

            <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">

              <SubscriptionStatCard
                title="New requests"
                value={
                  data?.summary.NEW ?? 0
                }
                icon={Inbox}
                description="Awaiting first contact"
              />

              <SubscriptionStatCard
                title="Contacted"
                value={
                  data?.summary.CONTACTED ?? 0
                }
                icon={Phone}
                description="Follow-up started"
              />

              <SubscriptionStatCard
                title="Qualified"
                value={
                  data?.summary.QUALIFIED ?? 0
                }
                icon={UserCheck}
                description="Potential customers"
              />

              <SubscriptionStatCard
                title="Converted"
                value={
                  data?.summary.CONVERTED ?? 0
                }
                icon={CheckCircle2}
                description="Successfully onboarded"
              />

            </div>

          )}

        </section>

        {/* =================================================
         * REQUESTS PANEL
         * ================================================= */}

        <section className="min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">

          {/* Panel heading */}

          <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div className="min-w-0">

              <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                Incoming requests
              </h2>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Manage inquiries submitted through
                the ValYou website.
              </p>

            </div>

            {!query.isLoading &&
              !query.isError &&
              data && (

                <div className="flex shrink-0 items-center">

                  <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    {data.meta.total}{" "}
                    {data.meta.total === 1
                      ? "request"
                      : "requests"}
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

              <p className="text-sm font-medium">
                Filters
              </p>

            </div>

            {/* Search + status */}

            <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,200px)]">

              {/* Search */}

              <div className="relative min-w-0">

                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(
                      event.target.value
                    )
                  }
                  placeholder="Search business, owner, email or phone..."
                  aria-label="Search account requests"
                  className="h-10 w-full min-w-0 pl-10"
                />

              </div>

              {/* Status */}

              <NativeSelect
                className="w-full min-w-0"
                value={status}
                aria-label="Filter account requests by status"
                onChange={(event) =>
                  changeStatus(
                    event.currentTarget
                      .value as StatusFilter
                  )
                }
              >

                {statusOptions.map(
                  (option) => (

                    <NativeSelectOption
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </NativeSelectOption>

                  )
                )}

              </NativeSelect>

            </div>

            {/* Filter footer */}

            <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">

              <p className="text-xs text-muted-foreground">

                {hasFilters
                  ? "Showing requests matching your filters"
                  : "Showing all account requests"}

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

          {query.isLoading ? (

            <RequestsLoading />

          ) : query.isError ? (

            <RequestErrorState
              onRetry={() => {
                void query.refetch();
              }}
            />

          ) : !data ||
            data.items.length === 0 ? (

            <RequestsEmptyState
              hasFilters={hasFilters}
              onClear={clearFilters}
            />

          ) : (

            <>

              {/* =============================================
               * MOBILE + TABLET CARDS
               * ============================================= */}

              <div className="grid min-w-0 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 xl:hidden">

                {data.items.map(
                  (request) => (

                    <RequestMobileCard
                      key={request.id}
                      request={request}
                      onManage={() =>
                        openManage(request)
                      }
                    />

                  )
                )}

              </div>

              {/* =============================================
               * DESKTOP TABLE
               * ============================================= */}

              <div className="hidden min-w-0 w-full xl:block">

                <div className="w-full overflow-x-auto">

                  <table className="w-full min-w-[1000px] text-left text-sm">

                    <thead className="border-b bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">

                      <tr>

                        <th className="px-5 py-4 font-medium">
                          Business
                        </th>

                        <th className="px-4 py-4 font-medium">
                          Contact
                        </th>

                        <th className="px-4 py-4 font-medium">
                          Cards
                        </th>

                        <th className="px-4 py-4 font-medium">
                          Email
                        </th>

                        <th className="px-4 py-4 font-medium">
                          Status
                        </th>

                        <th className="px-4 py-4 font-medium">
                          Submitted
                        </th>

                        <th className="px-5 py-4 text-right font-medium">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-border/60">

                      {data.items.map(
                        (request) => (

                          <RequestTableRow
                            key={request.id}
                            request={request}
                            onManage={() =>
                              openManage(request)
                            }
                          />

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* =============================================
               * PAGINATION
               * ============================================= */}

              <div className="flex flex-col gap-3 border-t border-border/60 bg-muted/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                {/* Results */}

                <div className="min-w-0">

                  <p className="text-xs text-muted-foreground">

                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {data.items.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {data.meta.total}
                    </span>{" "}
                    requests

                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Page {page} of{" "}
                    {Math.max(
                      1,
                      data.meta.totalPages
                    )}
                  </p>

                </div>

                {/* Pagination buttons */}

                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 w-full sm:w-auto"
                    disabled={
                      page <= 1 ||
                      query.isFetching
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current - 1
                          )
                      )
                    }
                  >
                    Previous
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 w-full sm:w-auto"
                    disabled={
                      page >=
                        data.meta.totalPages ||
                      query.isFetching
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          current + 1
                      )
                    }
                  >
                    Next
                  </Button>

                </div>

              </div>

            </>

          )}

        </section>

      </div>

      {/* =================================================
       * MANAGE DIALOG
       * ================================================= */}

      <ManageAccountRequestDialog
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onOpenChange={closeManage}
      />

    </>
  );
}

/*
 * =========================================================
 * DESKTOP TABLE ROW
 * =========================================================
 */

function RequestTableRow({
  request,
  onManage,
}: {
  request: AccountRequest;

  onManage: () => void;
}) {
  return (
    <tr className="transition-colors hover:bg-muted/30">

      {/* Business */}

      <td className="px-5 py-4 align-middle">

        <div className="min-w-[130px] max-w-[230px]">

          <p
            className="truncate font-medium"
            title={request.shopName}
          >
            {request.shopName}
          </p>

          <p
            className="mt-1 truncate text-xs text-muted-foreground"
            title={request.ownerName}
          >
            {request.ownerName}
          </p>

        </div>

      </td>

      {/* Contact */}

      <td className="px-4 py-4 align-middle">

        <div className="min-w-[115px]">

          <a
            href={`tel:${request.phone}`}
            className="font-medium transition-colors hover:text-emerald-600 hover:underline dark:hover:text-emerald-400"
          >
            {request.phone}
          </a>

          <p className="mt-1 text-xs text-muted-foreground">
            {request.businessType ?? "—"}
          </p>

        </div>

      </td>

      {/* Requested cards */}

      <td className="px-4 py-4 align-middle">

        <span className="inline-flex rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold">

          {request.requestedCards}

        </span>

      </td>

      {/* Email */}

      <td className="px-4 py-4 align-middle">

        {request.email ? (

          <a
            href={`mailto:${request.email}`}
            className="block max-w-[190px] truncate text-sm transition-colors hover:text-emerald-600 hover:underline dark:hover:text-emerald-400"
            title={request.email}
          >

            {request.email}

          </a>

        ) : (

          <span className="text-muted-foreground">
            —
          </span>

        )}

      </td>

      {/* Status */}

      <td className="px-4 py-4 align-middle">

        <RequestStatusBadge
          status={request.status}
        />

      </td>

      {/* Submitted */}

      <td className="whitespace-nowrap px-4 py-4 align-middle text-sm text-muted-foreground">

        {formatDate(
          request.createdAt
        )}

      </td>

      {/* Action */}

      <td className="px-5 py-4 text-right align-middle">

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onManage}
        >

          Manage

        </Button>

      </td>

    </tr>
  );
}

/*
 * =========================================================
 * MOBILE + TABLET CARD
 * =========================================================
 */

function RequestMobileCard({
  request,
  onManage,
}: {
  request: AccountRequest;

  onManage: () => void;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-background">

      {/* Card header */}

      <div className="min-w-0 p-4">

        <div className="flex min-w-0 items-start gap-3">

          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

            <Inbox className="size-5 text-emerald-600 dark:text-emerald-400" />

          </div>

          <div className="min-w-0 flex-1">

            <h3
              className="truncate text-base font-semibold"
              title={request.shopName}
            >
              {request.shopName}
            </h3>

            <p className="mt-1 truncate text-sm text-muted-foreground">
              {request.ownerName}
            </p>

          </div>

        </div>

        <div className="mt-3">

          <RequestStatusBadge
            status={request.status}
          />

        </div>

      </div>

      {/* Card content */}

      <div className="min-w-0 flex-1 space-y-4 px-4 pb-4">

        {/* Details */}

        <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4">

          <div className="min-w-0">

            <p className="text-xs text-muted-foreground">
              Requested cards
            </p>

            <p className="mt-1 text-sm font-semibold">
              {request.requestedCards}
            </p>

          </div>

          <div className="min-w-0">

            <p className="text-xs text-muted-foreground">
              Submitted
            </p>

            <p className="mt-1 text-sm font-semibold">
              {formatDate(
                request.createdAt
              )}
            </p>

          </div>

        </div>

        {/* Business type */}

        {request.businessType && (

          <div className="min-w-0">

            <p className="text-xs text-muted-foreground">
              Business type
            </p>

            <p className="mt-1 text-sm font-medium">
              {request.businessType}
            </p>

          </div>

        )}

        {/* Phone */}

        <div className="min-w-0">

          <p className="text-xs text-muted-foreground">
            Phone
          </p>

          <a
            href={`tel:${request.phone}`}
            className="mt-1 flex max-w-full items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400"
          >

            <Phone className="size-4 shrink-0" />

            <span className="min-w-0 break-all">
              {request.phone}
            </span>

          </a>

        </div>

        {/* Email */}

        {request.email && (

          <div className="min-w-0">

            <p className="text-xs text-muted-foreground">
              Email
            </p>

            <a
              href={`mailto:${request.email}`}
              className="mt-1 flex min-w-0 items-start gap-2 text-sm text-emerald-600 dark:text-emerald-400"
            >

              <Mail className="mt-0.5 size-4 shrink-0" />

              <span className="min-w-0 break-all">
                {request.email}
              </span>

            </a>

          </div>

        )}

      </div>

      {/* Card footer */}

      <div className="border-t border-border/60 bg-muted/20 p-3">

        <Button
          type="button"
          variant="outline"
          className="h-10 w-full"
          onClick={onManage}
        >

          Manage request

        </Button>

      </div>

    </article>
  );
}

/*
 * =========================================================
 * STATUS BADGE
 * =========================================================
 */

function RequestStatusBadge({
  status,
}: {
  status: AccountRequestStatus;
}) {
  const styles: Record<
    AccountRequestStatus,
    string
  > = {
    NEW:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",

    CONTACTED:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400",

    QUALIFIED:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",

    CONVERTED:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",

    CLOSED:
      "bg-muted text-muted-foreground",
  };

  return (
    <Badge
      variant="secondary"
      className={
        styles[status]
      }
    >
      {status
        .toLowerCase()
        .replace(
          /^\w/,
          character =>
            character.toUpperCase()
        )}
    </Badge>
  );
}

/*
 * =========================================================
 * ERROR STATE
 * =========================================================
 */

function RequestErrorState({
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
          Unable to load requests
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Something went wrong while loading
          account requests. Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={onRetry}
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
 * EMPTY STATE
 * =========================================================
 */

function RequestsEmptyState({
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

          <Inbox className="size-6 text-muted-foreground" />

        </div>

        <h3 className="mt-4 text-lg font-semibold">

          {hasFilters
            ? "No matching requests"
            : "No account requests yet"}

        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">

          {hasFilters
            ? "Try a different search or clear your filters."
            : "New account requests from the public ValYou website will appear here."}

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

/*
 * =========================================================
 * STATISTICS LOADING
 * =========================================================
 */

function RequestStatsLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">

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
 * REQUESTS LOADING
 * =========================================================
 */

function RequestsLoading() {
  return (
    <>

      {/* Mobile and tablet */}

      <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-5 xl:hidden">

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

      <div className="hidden space-y-3 p-5 xl:block">

        {Array.from({
          length: 7,
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
 * DATE FORMATTING
 * =========================================================
 */

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );
}