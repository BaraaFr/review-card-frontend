"use client";

import { useState } from "react";

import {
  ExternalLink,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Radio,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import type { Store } from "@/types/business";

import { useBusinesses } from "@/hooks/business/use-businesses";
import { useStores } from "@/hooks/stores/use-store";

import { useBusinessStore } from "@/stores/business.store";

import { StoreFormDialog } from "@/components/locations/store-form-dialog";
import { DeleteStoreDialog } from "@/components/locations/delete-store-dialog";

import { LocationGoogleConnection } from "@/components/google/location-google-connection";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LocationsPage() {
  const { businessId } =
    useBusinessStore();

  const {
    data: businesses = [],
  } =
    useBusinesses();

  const {
    data: stores = [],
    isLoading,
  } =
    useStores(
      businessId
    );

  const [
    formOpen,
    setFormOpen,
  ] =
    useState(false);

  const [
    editingStore,
    setEditingStore,
  ] =
    useState<Store | null>(
      null
    );

  const [
    deleteStore,
    setDeleteStore,
  ] =
    useState<Store | null>(
      null
    );

  const selectedBusiness =
    businesses.find(
      (business) =>
        business.id ===
        businessId
    );

  function openCreate() {
    setEditingStore(
      null
    );

    setFormOpen(
      true
    );
  }

  function openEdit(
    store: Store
  ) {
    setEditingStore(
      store
    );

    setFormOpen(
      true
    );
  }

  /*
   * --------------------------------
   * No business selected
   * --------------------------------
   */
  if (!businessId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div className="w-full max-w-md">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
            <MapPin className="size-6 text-muted-foreground" />
          </div>

          <h2 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
            No business selected
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Select one of your
            assigned businesses
            from the sidebar to
            manage its locations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
        {/*
         * --------------------------------
         * Page header
         * --------------------------------
         */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {selectedBusiness?.name && (
              <p className="truncate text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {
                  selectedBusiness.name
                }
              </p>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Locations
              </h1>

              {!isLoading &&
                stores.length >
                  0 && (
                  <Badge variant="secondary">
                    {
                      stores.length
                    }{" "}
                    {stores.length ===
                    1
                      ? "location"
                      : "locations"}
                  </Badge>
                )}
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage your
              branches, Google
              Review links and
              Google Reputation
              connections.
            </p>
          </div>

          <Button
            type="button"
            onClick={
              openCreate
            }
            className="w-full shrink-0 sm:w-auto"
          >
            <Plus className="size-4" />

            Add location
          </Button>
        </div>

        {/*
         * --------------------------------
         * Loading
         * --------------------------------
         */}
        {isLoading ? (
          <LocationsLoading />
        ) : stores.length ===
          0 ? (
          <LocationsEmpty
            onCreate={
              openCreate
            }
          />
        ) : (
          /*
           * --------------------------------
           * Location list
           * --------------------------------
           */
          <div className="grid gap-4">
            {stores.map(
              (
                store
              ) => (
                <LocationCard
                  key={
                    store.id
                  }
                  store={
                    store
                  }
                  onEdit={() =>
                    openEdit(
                      store
                    )
                  }
                  onDelete={() =>
                    setDeleteStore(
                      store
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {/*
       * --------------------------------
       * Create / Edit
       * --------------------------------
       */}
      <StoreFormDialog
        open={formOpen}
        onOpenChange={(
          open
        ) => {
          setFormOpen(
            open
          );

          if (!open) {
            setEditingStore(
              null
            );
          }
        }}
        businessId={
          businessId
        }
        store={
          editingStore
        }
      />

      {/*
       * --------------------------------
       * Delete
       * --------------------------------
       */}
      <DeleteStoreDialog
        open={Boolean(
          deleteStore
        )}
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setDeleteStore(
              null
            );
          }
        }}
        store={
          deleteStore
        }
      />
    </>
  );
}

function LocationCard({
  store,
  onEdit,
  onDelete,
}: {
  store: Store;

  onEdit: () => void;

  onDelete: () => void;
}) {
  const hasReviewUrl =
    Boolean(
      store.googleReviewUrl
    );

  const cardsCount =
    store._count
      ?.cards ??
    0;

  const interactionsCount =
    store._count
      ?.interactions ??
    0;

  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-colors hover:border-border">
      {/*
       * --------------------------------
       * Main information
       * --------------------------------
       */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/*
           * Location icon
           */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 sm:size-11">
            <MapPin className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          {/*
           * Content
           */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="min-w-0 truncate font-semibold">
                {
                  store.name
                }
              </h2>

              {hasReviewUrl ? (
                <Badge
                  variant="secondary"
                  className="shrink-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                >
                  <Radio className="size-3" />

                  Review link ready
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="shrink-0 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                >
                  <TriangleAlert className="size-3" />

                  Review link missing
                </Badge>
              )}
            </div>

            <div className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />

              <p className="min-w-0 break-words leading-5">
                {store.address ??
                  "No address added"}
              </p>
            </div>

            {/*
             * Stats
             */}
            <div className="mt-4 flex flex-wrap gap-2">
              <StatPill>
                {cardsCount.toLocaleString()}{" "}
                {cardsCount ===
                1
                  ? "card"
                  : "cards"}
              </StatPill>

              <StatPill>
                {interactionsCount.toLocaleString()}{" "}
                {interactionsCount ===
                1
                  ? "interaction"
                  : "interactions"}
              </StatPill>
            </div>
          </div>

          {/*
           * --------------------------------
           * Actions
           * --------------------------------
           */}
          <div className="flex shrink-0 items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${store.name}`}
                  />
                }
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="min-w-48"
              >
                <DropdownMenuGroup>
                  {store.googleReviewUrl && (
                    <DropdownMenuItem
                      render={
                        <a
                          href={
                            store.googleReviewUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      <ExternalLink className="size-4" />

                      Open review page
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={
                      onEdit
                    }
                  >
                    <Pencil className="size-4" />

                    Edit location
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={
                      onDelete
                    }
                    variant="destructive"
                  >
                    <Trash2 className="size-4" />

                    Delete location
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/*
       * --------------------------------
       * Google integration
       *
       * Important UX change:
       *
       * Give this its own full-width
       * section instead of squeezing
       * it into the location row.
       * --------------------------------
       */}
      <div className="border-t border-border/60 bg-muted/10 p-3 sm:p-4">
        <LocationGoogleConnection
          store={store}
        />
      </div>
    </article>
  );
}

function StatPill({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function LocationsLoading() {
  return (
    <div className="grid gap-4">
      {Array.from({
        length: 3,
      }).map(
        (
          _,
          index
        ) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border/70"
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="size-11 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />

                  <Skeleton className="h-4 w-64 max-w-full" />

                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-7 w-20 rounded-full" />

                    <Skeleton className="h-7 w-28 rounded-full" />
                  </div>
                </div>

                <Skeleton className="size-9 shrink-0 rounded-lg" />
              </div>
            </div>

            <div className="border-t p-4">
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

function LocationsEmpty({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <MapPin className="size-6 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight">
          Add your first
          location
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Locations represent
          the branches where your
          ValYou cards are
          placed. Each location
          can have its own Google
          Review page and
          reputation data.
        </p>

        <Button
          type="button"
          className="mt-6 w-full sm:w-auto"
          onClick={
            onCreate
          }
        >
          <Plus className="size-4" />

          Add location
        </Button>
      </div>
    </div>
  );
}