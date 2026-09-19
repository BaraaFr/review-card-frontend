"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { cardsService } from "@/services/cards.service";
import {
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Search,
  QrCode,
  Radio,
  RefreshCw,
  SlidersHorizontal,
  Unlink,
  UserRoundPlus,
  WalletCards,
  X,
} from "lucide-react";

import type { CardStatus, ReviewCard } from "@/types/card";

import { cardKeys, useCards } from "@/hooks/cards/use-card";

import { CardStatusBadge } from "@/components/cards/card-status";

import { CardDetailsDialog } from "@/components/cards/card-details-dialog";

import { CreateCardDialog } from "@/components/admin/cards/create-card-dialog";

import { AssignCardDialog } from "@/components/admin/cards/assign-card-dialog";

import { UnassignCardDialog } from "@/components/admin/cards/unassign-card-dialog";

import { DeliverCardDialog } from "@/components/cards/deliver-card-dialog";

import { RefreshButton } from "@/components/common/refresh-button";

import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

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

const PAGE_SIZE = 10;

/*
 * =========================================================
 * PAGE
 * =========================================================
 */

export default function AdminCardsPage() {
  const [page, setPage] = useState(1);

  const [status, setStatus] = useState<"" | CardStatus>("");

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const [detailsCard, setDetailsCard] = useState<ReviewCard | null>(null);

  const [assignCard, setAssignCard] = useState<ReviewCard | null>(null);

  const [unassignCard, setUnassignCard] = useState<ReviewCard | null>(null);

  const [deliverCard, setDeliverCard] = useState<ReviewCard | null>(null);

  /*
   * =======================================================
   * Cards query
   * =======================================================
   */
  /*
   * =======================================================
   * Normal server-side pagination
   * =======================================================
   */

  const {
    data: serverData,
    isLoading: serverLoading,
    isError: serverError,
    isFetching: serverFetching,
    refetch: refetchPage,
  } = useCards({
    page,

    limit: PAGE_SIZE,

    status: status || undefined,
  });

  /*
   * =======================================================
   * Frontend search across ALL inventory
   * =======================================================
   */

  const normalizedSearch = search.trim().toLowerCase();

  const searchActive = normalizedSearch.length > 0;

  /*
   * Fetch all cards only when the admin searches.
   *
   * The backend currently allows a maximum
   * of 100 records per request.
   */

  const searchIndexQuery = useQuery({
    queryKey: [...cardKeys.all, "admin-search-index", status],

    enabled: searchActive,

    queryFn: async () => {
      const firstPage = await cardsService.getAll({
        page: 1,

        limit: 100,

        status: status || undefined,
      });

      const allCards: ReviewCard[] = [...firstPage.cards];

      for (
        let nextPage = 2;
        nextPage <= firstPage.pagination.totalPages;
        nextPage++
      ) {
        const result = await cardsService.getAll({
          page: nextPage,

          limit: 100,

          status: status || undefined,
        });

        allCards.push(...result.cards);
      }

      return allCards;
    },

    staleTime: 30 * 1000,
  });

  /*
   * =======================================================
   * Client-side filtering
   * =======================================================
   */

  const matchingCards = useMemo(() => {
    if (!searchActive) {
      return [];
    }

    const inventory = searchIndexQuery.data ?? [];

    return inventory.filter((card) => {
      const searchable = [
        card.label ?? "",

        card.code,

        card.status,

        card.store?.business?.name ?? "",

        card.store?.name ?? "",

        card.paymentMethod ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [searchActive, normalizedSearch, searchIndexQuery.data]);

  /*
   * =======================================================
   * Unified page data
   *
   * Without search:
   *   use the existing backend pagination.
   *
   * With search:
   *   paginate matching cards in the frontend.
   * =======================================================
   */

  const cards = searchActive
    ? matchingCards.slice(
        (page - 1) * PAGE_SIZE,

        page * PAGE_SIZE
      )
    : serverData?.cards ?? [];

  const pagination = searchActive
    ? {
        page,

        limit: PAGE_SIZE,

        total: matchingCards.length,

        totalPages: Math.ceil(matchingCards.length / PAGE_SIZE),
      }
    : serverData?.pagination;

  const isLoading = searchActive ? searchIndexQuery.isPending : serverLoading;

  const isError = searchActive ? searchIndexQuery.isError : serverError;

  const isFetching = searchActive
    ? searchIndexQuery.isFetching
    : serverFetching;

  const retryCards = () => {
    if (searchActive) {
      void searchIndexQuery.refetch();
    } else {
      void refetchPage();
    }
  };

  /*
   * Inventory summary.
   *
   * These queries intentionally use
   * limit: 1 because only their
   * pagination totals are required.
   */

  const hasFilters = Boolean(status) || Boolean(search.trim());

  const changeStatus = (value: "" | CardStatus) => {
    setStatus(value);

    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");

    setStatus("");

    setPage(1);
  };

  /*
   * =======================================================
   * Card actions
   * =======================================================
   */

  const actions: CardActions = {
    onDetails: setDetailsCard,

    onAssign: setAssignCard,

    onUnassign: setUnassignCard,

    onDeliver: setDeliverCard,
  };

  return (
    <>
      <div className="w-full min-w-0 max-w-full space-y-6 pb-8 sm:space-y-7">
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
                  Inventory management
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Review Cards
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Create and manage ValYou card inventory, assign cards to
                business locations, and manage permanent QR and NFC links.
              </p>
            </div>

            {/* Header actions */}

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto lg:shrink-0 lg:pb-1">
              <RefreshButton queryKey={cardKeys.all} />

              <Button
                type="button"
                className="h-9 flex-1 gap-2 sm:flex-none"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="size-4" />
                Create card
              </Button>
            </div>
          </div>
        </header>

        {/* =================================================
         * INVENTORY STATISTICS
         * ================================================= */}

        <section aria-label="Card inventory overview" className="min-w-0">
          <div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            <InventoryMetric
              label="Ready"
              description="Available to assign"
              value={
                serverData?.summary.ready
              }
              loading={isLoading}
              icon={WalletCards}
            />

            <InventoryMetric
              label="Active"
              description="Assigned and active"
              value={
                serverData?.summary.active
              }
              loading={
                isLoading
              }
              icon={Radio}
            />

            <div className="min-w-0 min-[420px]:col-span-2 xl:col-span-1">
              <InventoryMetric
                label="Inactive"
                description="Currently inactive"
                value={
                  serverData?.summary.inactive
                }
                loading={
                  isLoading
                }
                icon={Unlink}
              />
            </div>
          </div>
        </section>

        {/* =================================================
         * CARDS PANEL
         * ================================================= */}

        <section className="min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          {/* Panel heading */}

          <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                Card inventory
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Track your physical cards, assignments, and delivery status.
              </p>
            </div>

            {!isLoading && !isError && pagination && (
              <span className="w-fit shrink-0 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {pagination.total} {pagination.total === 1 ? "card" : "cards"}
              </span>
            )}
          </div>

          {/* =================================================
           * FILTERS
           * ================================================= */}

          {/* =================================================
           * FILTERS
           * ================================================= */}

          <div className="space-y-3 border-b border-border/60 bg-muted/20 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-muted-foreground" />

              <p className="text-sm font-medium">Filters</p>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,220px)]">
              {/* Search */}

              <div className="relative min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);

                    setPage(1);
                  }}
                  placeholder="Search card, code, business or location..."
                  aria-label="Search review cards"
                  className="h-10 w-full min-w-0 pl-10 pr-10"
                />

                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearch("");

                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Status */}

              <NativeSelect
                className="w-full min-w-0"
                value={status}
                aria-label="Filter cards by status"
                onChange={(event) =>
                  changeStatus(event.currentTarget.value as "" | CardStatus)
                }
              >
                <NativeSelectOption value="">All cards</NativeSelectOption>

                <NativeSelectOption value="UNASSIGNED">
                  Ready
                </NativeSelectOption>

                <NativeSelectOption value="ACTIVE">Active</NativeSelectOption>

                <NativeSelectOption value="INACTIVE">
                  Inactive
                </NativeSelectOption>
              </NativeSelect>
            </div>

            {/* Filter summary */}

            <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {isLoading && searchActive
                  ? "Searching inventory..."
                  : searchActive
                  ? `${pagination?.total ?? 0} matching cards`
                  : status
                  ? `Showing ${
                      status === "UNASSIGNED" ? "ready" : status.toLowerCase()
                    } cards`
                  : "Showing all inventory cards"}
              </p>

              {(search || status) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
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
            <CardsLoading />
          ) : isError ? (
            <CardsErrorState onRetry={retryCards} />
          ) : cards.length === 0 ? (
            <CardsEmptyState
              hasFilters={hasFilters}
              onClear={clearFilters}
              onCreate={() => setCreateOpen(true)}
            />
          ) : (
            <>
              {/* =============================================
               * MOBILE / TABLET CARDS
               * ============================================= */}

              <div className="grid min-w-0 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 xl:hidden">
                {cards.map((card) => (
                  <InventoryMobileCard
                    key={card.id}
                    card={card}
                    actions={actions}
                  />
                ))}
              </div>

              {/* =============================================
               * DESKTOP TABLE
               * ============================================= */}

              <div className="hidden min-w-0 w-full xl:block">
                {/*
                 * The shared Table component
                 * already provides its own
                 * horizontal scroll container.
                 */}

                <Table className="min-w-[960px]">
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-5">Card</TableHead>

                      <TableHead>Status</TableHead>

                      <TableHead>Business</TableHead>

                      <TableHead>Location</TableHead>

                      <TableHead className="text-right">Interactions</TableHead>

                      <TableHead>Payment</TableHead>

                      <TableHead className="w-[72px] pr-5 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {cards.map((card) => (
                      <InventoryTableRow
                        key={card.id}
                        card={card}
                        actions={actions}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* =============================================
               * PAGINATION
               * ============================================= */}

              {pagination && (
                <div className="flex flex-col gap-3 border-t border-border/60 bg-muted/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  {/* Pagination information */}

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Showing{" "}
                      <span className="font-medium text-foreground">
                        {cards.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-foreground">
                        {pagination.total}
                      </span>{" "}
                      cards
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Page {pagination.page} of{" "}
                      {Math.max(1, pagination.totalPages)}
                    </p>
                  </div>

                  {/* Pagination controls */}

                  {pagination.totalPages > 1 && (
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-full sm:w-auto"
                        disabled={page <= 1 || isFetching}
                        onClick={() =>
                          setPage((current) => Math.max(1, current - 1))
                        }
                      >
                        <ChevronLeft className="size-4" />
                        Previous
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-full sm:w-auto"
                        disabled={page >= pagination.totalPages || isFetching}
                        onClick={() => setPage((current) => current + 1)}
                      >
                        Next
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* ===================================================
       * EXISTING DIALOGS
       * =================================================== */}

      <CreateCardDialog open={createOpen} onOpenChange={setCreateOpen} />

      <DeliverCardDialog
        card={deliverCard}
        open={Boolean(deliverCard)}
        onOpenChange={(open) => {
          if (!open) {
            setDeliverCard(null);
          }
        }}
      />

      <CardDetailsDialog
        card={detailsCard}
        open={Boolean(detailsCard)}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsCard(null);
          }
        }}
      />

      <AssignCardDialog
        card={assignCard}
        open={Boolean(assignCard)}
        onOpenChange={(open) => {
          if (!open) {
            setAssignCard(null);
          }
        }}
      />

      <UnassignCardDialog
        card={unassignCard}
        open={Boolean(unassignCard)}
        onOpenChange={(open) => {
          if (!open) {
            setUnassignCard(null);
          }
        }}
      />
    </>
  );
}

/*
 * =========================================================
 * Action types
 * =========================================================
 */

type CardActions = {
  onDetails: (card: ReviewCard) => void;

  onAssign: (card: ReviewCard) => void;

  onUnassign: (card: ReviewCard) => void;

  onDeliver: (card: ReviewCard) => void;
};

/*
 * =========================================================
 * DESKTOP TABLE ROW
 * =========================================================
 */

function InventoryTableRow({
  card,
  actions,
}: {
  card: ReviewCard;

  actions: CardActions;
}) {
  return (
    <TableRow className="hover:bg-muted/30">
      {/* Card */}

      <TableCell className="pl-5">
        <CardIdentity card={card} />
      </TableCell>

      {/* Status */}

      <TableCell>
        <CardStatusBadge status={card.status} />
      </TableCell>

      {/* Business */}

      <TableCell>
        <p
          className="max-w-[160px] truncate text-sm"
          title={card.store?.business?.name ?? undefined}
        >
          {card.store?.business?.name ?? "—"}
        </p>
      </TableCell>

      {/* Location */}

      <TableCell>
        <p
          className="max-w-[150px] truncate text-sm"
          title={card.store?.name ?? undefined}
        >
          {card.store?.name ?? "Not assigned"}
        </p>
      </TableCell>

      {/* Interactions */}

      <TableCell className="text-right font-medium">
        {card._count?.interactions ?? 0}
      </TableCell>

      {/* Payment */}

      <TableCell>
        <CardPaymentStatus card={card} />
      </TableCell>

      {/* Actions */}

      <TableCell className="pr-5 text-right">
        <CardActionsMenu card={card} actions={actions} />
      </TableCell>
    </TableRow>
  );
}

/*
 * =========================================================
 * MOBILE / TABLET CARD
 * =========================================================
 */

function InventoryMobileCard({
  card,
  actions,
}: {
  card: ReviewCard;

  actions: CardActions;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-background">
      {/* Card header */}

      <div className="min-w-0 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <CreditCard className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="truncate text-base font-semibold"
              title={card.label ?? "Inventory Card"}
            >
              {card.label ?? "Inventory Card"}
            </h3>

            <p
              className="mt-1 truncate font-mono text-[11px] text-muted-foreground"
              title={card.code}
            >
              {card.code}
            </p>
          </div>

          <CardActionsMenu card={card} actions={actions} />
        </div>

        <div className="mt-3">
          <CardStatusBadge status={card.status} />
        </div>
      </div>

      {/* Card body */}

      <div className="min-w-0 flex-1 space-y-4 px-4 pb-4">
        {/* Assignment information */}

        <div className="grid grid-cols-1 gap-3 border-t border-border/60 pt-4 min-[420px]:grid-cols-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Business</p>

            <p
              className="mt-1 truncate text-sm font-medium"
              title={card.store?.business?.name ?? undefined}
            >
              {card.store?.business?.name ?? "Not assigned"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Location</p>

            <p
              className="mt-1 truncate text-sm font-medium"
              title={card.store?.name ?? undefined}
            >
              {card.store?.name ?? "Not assigned"}
            </p>
          </div>
        </div>

        {/* Operational information */}

        <div className="grid grid-cols-1 gap-3 border-t border-border/60 pt-4 min-[420px]:grid-cols-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Interactions</p>

            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
              <Radio className="size-4 text-muted-foreground" />

              {card._count?.interactions ?? 0}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Payment</p>

            <div className="mt-1">
              <CardPaymentStatus card={card} />
            </div>
          </div>
        </div>
      </div>

      {/* Card footer */}

      <div className="border-t border-border/60 bg-muted/20 p-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-0 flex-1"
            onClick={() => actions.onDetails(card)}
          >
            <QrCode className="size-4" />
            QR & NFC
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-0 flex-1"
            onClick={() => actions.onAssign(card)}
          >
            <UserRoundPlus className="size-4" />

            {card.storeId ? "Reassign" : "Assign"}
          </Button>
        </div>
      </div>
    </article>
  );
}

/*
 * =========================================================
 * CARD IDENTITY
 * =========================================================
 */

function CardIdentity({ card }: { card: ReviewCard }) {
  return (
    <div className="flex min-w-[145px] max-w-[230px] items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
        <CreditCard className="size-5 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="truncate font-medium"
          title={card.label ?? "Inventory Card"}
        >
          {card.label ?? "Inventory Card"}
        </p>

        <p
          className="mt-1 truncate font-mono text-[11px] text-muted-foreground"
          title={card.code}
        >
          {card.code}
        </p>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * PAYMENT DISPLAY
 * =========================================================
 */

function CardPaymentStatus({ card }: { card: ReviewCard }) {
  if (card.paidAt) {
    return (
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Paid
          {card.salePriceCents !== null && (
            <>
              {" · "}

              {formatUSD(card.salePriceCents)}
            </>
          )}
        </p>

        {card.paymentMethod && (
          <p className="text-xs text-muted-foreground">{card.paymentMethod}</p>
        )}
      </div>
    );
  }

  return (
    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
      {card.storeId ? "Awaiting payment" : "Not assigned"}
    </span>
  );
}

function formatUSD(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/*
 * =========================================================
 * SHARED CARD ACTIONS
 * =========================================================
 */

function CardActionsMenu({
  card,
  actions,
}: {
  card: ReviewCard;

  actions: CardActions;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${card.label ?? card.code}`}
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {/* QR & NFC */}

          <DropdownMenuItem onClick={() => actions.onDetails(card)}>
            <QrCode className="size-4" />
            QR & NFC
          </DropdownMenuItem>

          {/* Assign / reassign */}

          <DropdownMenuItem onClick={() => actions.onAssign(card)}>
            <UserRoundPlus className="size-4" />

            {card.storeId ? "Reassign" : "Assign"}
          </DropdownMenuItem>

          {/* Record delivery */}

          {card.storeId && !card.deliveredAt && !card.paidAt && (
            <DropdownMenuItem onClick={() => actions.onDeliver(card)}>
              <PackageCheck className="size-4" />
              Mark delivered & paid
            </DropdownMenuItem>
          )}

          {/* Unassign */}

          {card.storeId && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => actions.onUnassign(card)}
            >
              <Unlink className="size-4" />
              Unassign
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/*
 * =========================================================
 * METRIC CARD
 * =========================================================
 */

function InventoryMetric({
  label,
  description,
  value,
  loading,
  icon: Icon,
}: {
  label: string;

  description: string;

  value?: number;

  loading: boolean;

  icon: LucideIcon;
}) {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
        </div>

        {loading ? (
          <Skeleton className="h-9 w-14 rounded-lg" />
        ) : (
          <span className="text-3xl font-semibold tracking-[-0.04em]">
            {value ?? "—"}
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium">{label}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * ERROR STATE
 * =========================================================
 */

function CardsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-72 items-center justify-center p-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="size-6 text-destructive" />
        </div>

        <h3 className="mt-4 text-lg font-semibold">Unable to load cards</h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Something went wrong while loading the card inventory.
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

function CardsEmptyState({
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
          <WalletCards className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-lg font-semibold">
          {hasFilters ? "No matching cards" : "No inventory cards yet"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {hasFilters
            ? "No cards match your search or selected status. Try adjusting your filters."
            : "Create your first card to generate its permanent QR and NFC links."}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={hasFilters ? onClear : onCreate}
        >
          {hasFilters ? <X className="size-4" /> : <Plus className="size-4" />}

          {hasFilters ? "Clear filters" : "Create card"}
        </Button>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * LOADING STATE
 * =========================================================
 */

function CardsLoading() {
  return (
    <>
      {/* Mobile / tablet */}

      <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-5 xl:hidden">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-xl" />
        ))}
      </div>

      {/* Desktop */}

      <div className="hidden space-y-3 p-5 xl:block">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </>
  );
}
