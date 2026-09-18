"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Inbox,
  Phone,
  Search,
  UserCheck,
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
  Skeleton,
} from "@/components/ui/skeleton";

import {
  ManageAccountRequestDialog,
} from "@/components/admin/account-requests/manage-account-requests-dialog";

import {
  useAdminAccountRequests,
} from "@/hooks/account-requests/use-admin-account-requests";

import type {
  AccountRequest,
  AccountRequestStatus,
} from "@/types/account-request";

const statusOptions:
  Array<{
    value:
      | "ALL"
      | AccountRequestStatus;

    label:
      string;
  }> =
  [
    {
      value:
        "ALL",

      label:
        "All requests",
    },

    {
      value:
        "NEW",

      label:
        "New",
    },

    {
      value:
        "CONTACTED",

      label:
        "Contacted",
    },

    {
      value:
        "QUALIFIED",

      label:
        "Qualified",
    },

    {
      value:
        "CONVERTED",

      label:
        "Converted",
    },

    {
      value:
        "CLOSED",

      label:
        "Closed",
    },
  ];

export default function AdminRequestsPage() {
  const [
    searchInput,
    setSearchInput,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState<
      | "ALL"
      | AccountRequestStatus
    >(
      "ALL"
    );

  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    selectedRequest,
    setSelectedRequest,
  ] =
    useState<AccountRequest | null>(
      null
    );

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setSearch(
            searchInput.trim()
          );

          setPage(
            1
          );
        },

        350
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    searchInput,
  ]);

  const query =
    useAdminAccountRequests({
      page,

      perPage:
        20,

      search:
        search ||
        undefined,

      status:
        status ===
        "ALL"
          ? undefined
          : status,
    });

  const data =
    query.data;

  return (
    <>
      <div className="space-y-7">
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Super Admin
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Account requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage businesses that
            requested ValYou cards
            from the public website,
            contact them and track
            their onboarding
            progress.
          </p>
        </div>

        {query.isLoading ? (
          <RequestStatsLoading />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="New"
              value={
                data?.summary.NEW ??
                0
              }
              icon={
                Inbox
              }
            />

            <SummaryCard
              label="Contacted"
              value={
                data?.summary
                  .CONTACTED ??
                0
              }
              icon={
                Phone
              }
            />

            <SummaryCard
              label="Qualified"
              value={
                data?.summary
                  .QUALIFIED ??
                0
              }
              icon={
                UserCheck
              }
            />

            <SummaryCard
              label="Converted"
              value={
                data?.summary
                  .CONVERTED ??
                0
              }
              icon={
                CheckCircle2
              }
            />
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={
                searchInput
              }
              onChange={(
                event
              ) =>
                setSearchInput(
                  event
                    .target
                    .value
                )
              }
              placeholder="Search owner, email,  business or phone..."
              className="pl-9"
            />
          </div>

          <select
            value={
              status
            }
            onChange={(
              event
            ) => {
              setStatus(
                event
                  .target
                  .value as
                  | "ALL"
                  | AccountRequestStatus
              );

              setPage(
                1
              );
            }}
            className="flex h-10 min-w-48 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            {statusOptions.map(
              (
                option
              ) => (
                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </option>
              )
            )}
          </select>
        </div>

        {query.isLoading ? (
          <RequestsLoading />
        ) : query.isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <p className="font-medium">
              Unable to load requests
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() =>
                query.refetch()
              }
            >
              Try again
            </Button>
          </div>
        ) : !data ||
          data.items.length ===
            0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <Inbox className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">
              No requests found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              New public account
              requests will appear
              here.
            </p>
          </div>
        ) : (
          <>
            {/*
             * Desktop
             */}
            <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-5 py-4">
                        Business
                      </th>

                      <th className="px-5 py-4">
                        Contact
                      </th>

                      <th className="px-5 py-4">
                        Cards
                      </th>

                      <th className="px-5 py-4">
                        Email
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Submitted
                      </th>

                      <th className="px-5 py-4 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border/60">
                    {data.items.map(
                      (
                        request
                      ) => (
                        <tr
                          key={
                            request.id
                          }
                          className="transition-colors hover:bg-muted/20"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium">
                              {
                                request.shopName
                              }
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {
                                request.ownerName
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <a
                              href={`tel:${request.phone}`}
                              className="hover:text-emerald-600 hover:underline"
                            >
                              {
                                request.phone
                              }
                            </a>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {
                                request.businessType ??
                                "—"
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            {
                              request.requestedCards
                            }
                          </td>


                          <td className="px-5 py-4">
                            {
                              request.email ?? "N/A"
                            }
                          </td>

                          <td className="px-5 py-4">
                            <RequestStatusBadge
                              status={
                                request.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4 text-muted-foreground">
                            {formatDate(
                              request.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedRequest(
                                  request
                                )
                              }
                            >
                              Manage
                            </Button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/*
             * Mobile
             */}
            <div className="grid gap-3 md:hidden">
              {data.items.map(
                (
                  request
                ) => (
                  <article
                    key={
                      request.id
                    }
                    className="rounded-2xl border border-border/70 bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {
                            request.shopName
                          }
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {
                            request.ownerName
                          }
                        </p>
                      </div>

                      <RequestStatusBadge
                        status={
                          request.status
                        }
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">
                          Cards
                        </p>

                        <p className="mt-1 font-medium">
                          {
                            request.requestedCards
                          }
                        </p>
                      </div>

                      <div className="rounded-xl bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">
                          Submitted
                        </p>

                        <p className="mt-1 font-medium">
                          {formatDate(
                            request.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${request.phone}`}
                      className="mt-4 flex items-center gap-2 text-sm text-emerald-600"
                    >
                      <Phone className="size-4" />

                      {
                        request.phone
                      }
                    </a>

                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() =>
                        setSelectedRequest(
                          request
                        )
                      }
                    >
                      Manage request
                    </Button>
                  </article>
                )
              )}
            </div>

            {/*
             * Pagination
             */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {
                  data.meta.total
                }{" "}
                request
                {data.meta.total ===
                1
                  ? ""
                  : "s"}
              </p>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={
                    page <=
                    1
                  }
                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        Math.max(
                          1,

                          current -
                            1
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
                  disabled={
                    page >=
                    data.meta
                      .totalPages
                  }
                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        current +
                        1
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <ManageAccountRequestDialog
        request={
          selectedRequest
        }
        open={Boolean(
          selectedRequest
        )}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRequest(
              null
            );
          }
        }}
      />
    </>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;

  value: number;

  icon:
    React.ComponentType<{
      className?: string;
    }>;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
        </div>

        <Clock3 className="size-4 text-muted-foreground/50" />
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function RequestStatusBadge({
  status,
}: {
  status:
    AccountRequestStatus;
}) {
  const styles:
    Record<
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
        styles[
          status
        ]
      }
    >
      {status
        .toLowerCase()
        .replace(
          /^\w/,
          (
            character
          ) =>
            character.toUpperCase()
        )}
    </Badge>
  );
}

function RequestStatsLoading() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({
        length: 4,
      }).map(
        (
          _,
          index
        ) => (
          <Skeleton
            key={
              index
            }
            className="h-32 rounded-2xl"
          />
        )
      )}
    </div>
  );
}

function RequestsLoading() {
  return (
    <div className="space-y-3">
      {Array.from({
        length: 6,
      }).map(
        (
          _,
          index
        ) => (
          <Skeleton
            key={
              index
            }
            className="h-20 rounded-2xl"
          />
        )
      )}
    </div>
  );
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",
    }
  ).format(
    new Date(
      value
    )
  );
}