"use client";

import {
  useState,
} from "react";

import {
  MoreHorizontal,
  Plus,
  QrCode,
  Radio,
  Unlink,
  UserRoundPlus,
  WalletCards,
} from "lucide-react";

import type {
  CardStatus,
  ReviewCard,
} from "@/types/card";

import {
  useCards,
} from "@/hooks/cards/use-card";

import {
  CardStatusBadge,
} from "@/components/cards/card-status";

import {
  CardDetailsDialog,
} from "@/components/cards/card-details-dialog";

import {
  CreateCardDialog,
} from "@/components/admin/cards/create-card-dialog";

import {
  AssignCardDialog,
} from "@/components/admin/cards/assign-card-dialog";

import {
  UnassignCardDialog,
} from "@/components/admin/cards/unassign-card-dialog";

import {
  Button,
} from "@/components/ui/button";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

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

export default function AdminCardsPage() {
  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    status,
    setStatus,
  ] =
    useState<
      "" | CardStatus
    >("");

  const [
    createOpen,
    setCreateOpen,
  ] =
    useState(false);

  const [
    detailsCard,
    setDetailsCard,
  ] =
    useState<
      ReviewCard | null
    >(null);

  const [
    assignCard,
    setAssignCard,
  ] =
    useState<
      ReviewCard | null
    >(null);

  const [
    unassignCard,
    setUnassignCard,
  ] =
    useState<
      ReviewCard | null
    >(null);

  const {
    data,
    isLoading,
  } =
    useCards({
      page,
      limit: 10,

      status:
        status ||
        undefined,
    });

  const readyQuery =
    useCards({
      page: 1,
      limit: 1,
      status:
        "UNASSIGNED",
    });

  const activeQuery =
    useCards({
      page: 1,
      limit: 1,
      status:
        "ACTIVE",
    });

  const inactiveQuery =
    useCards({
      page: 1,
      limit: 1,
      status:
        "INACTIVE",
    });

  const cards =
    data?.cards ??
    [];

  const pagination =
    data?.pagination;

  return (
    <>
      <div className="space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Inventory
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              Review Cards
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Create physical card
              inventory, assign cards
              to customers and manage
              permanent QR / NFC
              links.
            </p>
          </div>

          <Button
            onClick={() =>
              setCreateOpen(
                true
              )
            }
          >
            <Plus className="size-4" />

            Create card
          </Button>
        </div>

        {/* Inventory Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <InventoryMetric
            label="Ready"
            value={
              readyQuery.data
                ?.pagination
                .total ?? 0
            }
            icon={
              WalletCards
            }
          />

          <InventoryMetric
            label="Active"
            value={
              activeQuery.data
                ?.pagination
                .total ?? 0
            }
            icon={Radio}
          />

          <InventoryMetric
            label="Inactive"
            value={
              inactiveQuery.data
                ?.pagination
                .total ?? 0
            }
            icon={
              Unlink
            }
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 p-3">
          <div className="w-52">
            <NativeSelect
              value={
                status
              }
              onChange={(
                event
              ) => {
                setStatus(
                  event
                    .currentTarget
                    .value as
                    | ""
                    | CardStatus
                );

                setPage(1);
              }}
            >
              <NativeSelectOption value="">
                All cards
              </NativeSelectOption>

              <NativeSelectOption value="UNASSIGNED">
                Ready
              </NativeSelectOption>

              <NativeSelectOption value="ACTIVE">
                Active
              </NativeSelectOption>

              <NativeSelectOption value="INACTIVE">
                Inactive
              </NativeSelectOption>
            </NativeSelect>
          </div>

          <span className="text-sm text-muted-foreground">
            {pagination
              ?.total ??
              0}{" "}
            cards
          </span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({
                length: 6,
              }).map(
                (_, index) => (
                  <Skeleton
                    key={
                      index
                    }
                    className="h-14 w-full"
                  />
                )
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Card
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead>
                      Business
                    </TableHead>

                    <TableHead>
                      Location
                    </TableHead>

                    <TableHead className="text-right">
                      Interactions
                    </TableHead>

                    <TableHead className="w-14" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {cards.length ===
                  0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          6
                        }
                        className="h-40 text-center text-muted-foreground"
                      >
                        No cards found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cards.map(
                      (
                        card
                      ) => (
                        <TableRow
                          key={
                            card.id
                          }
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {card.label ??
                                  "Inventory Card"}
                              </p>

                              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                {
                                  card.code
                                }
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <CardStatusBadge
                              status={
                                card.status
                              }
                            />
                          </TableCell>

                          <TableCell>
                            {card.store
                              ?.business
                              ?.name ??
                              "—"}
                          </TableCell>

                          <TableCell>
                            {card.store
                              ?.name ??
                              "Not assigned"}
                          </TableCell>

                          <TableCell className="text-right font-medium">
                            {card
                              ._count
                              ?.interactions ??
                              0}
                          </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                  />
                                }
                              >
                                <MoreHorizontal className="size-4" />
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                align="end"
                              >
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setDetailsCard(
                                        card
                                      )
                                    }
                                  >
                                    <QrCode className="size-4" />

                                    QR & NFC
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() =>
                                      setAssignCard(
                                        card
                                      )
                                    }
                                  >
                                    <UserRoundPlus className="size-4" />

                                    {card.storeId
                                      ? "Reassign"
                                      : "Assign"}
                                  </DropdownMenuItem>

                                  {card.storeId && (
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onClick={() =>
                                        setUnassignCard(
                                          card
                                        )
                                      }
                                    >
                                      <Unlink className="size-4" />

                                      Unassign
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {pagination &&
          pagination.totalPages >
            1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page{" "}
                {
                  pagination.page
                }{" "}
                of{" "}
                {
                  pagination.totalPages
                }
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={
                    page <=
                    1
                  }
                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        current -
                        1
                    )
                  }
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  disabled={
                    page >=
                    pagination.totalPages
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
          )}
      </div>

      <CreateCardDialog
        open={
          createOpen
        }
        onOpenChange={
          setCreateOpen
        }
      />

      <CardDetailsDialog
        card={
          detailsCard
        }
        open={
          Boolean(
            detailsCard
          )
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setDetailsCard(
              null
            );
          }
        }}
      />

      <AssignCardDialog
        card={
          assignCard
        }
        open={
          Boolean(
            assignCard
          )
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setAssignCard(
              null
            );
          }
        }}
      />

      <UnassignCardDialog
        card={
          unassignCard
        }
        open={
          Boolean(
            unassignCard
          )
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setUnassignCard(
              null
            );
          }
        }}
      />
    </>
  );
}

function InventoryMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;

  value: number;

  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>

        <span className="text-3xl font-semibold tracking-[-0.04em]">
          {value}
        </span>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  );
}