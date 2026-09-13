"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CreditCard,
  Radio,
} from "lucide-react";

import type {
  CardStatus,
  ReviewCard,
} from "@/types/card";

import {
  useCards,
} from "@/hooks/cards/use-card";

import {
  useStores,
} from "@/hooks/stores/use-store";

import {
  useBusinesses,
} from "@/hooks/business/use-businesses";

import {
  useBusinessStore,
} from "@/stores/business.store";

import {
  ReviewCardItem,
} from "@/components/cards/review-card-item";

import {
  CardDetailsDialog,
} from "@/components/cards/card-details-dialog";

import {
  EditCardDialog,
} from "@/components/cards/edit-card-dialog";

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

export default function CardsPage() {
  const {
    businessId,
  } =
    useBusinessStore();

  const {
    data: businesses = [],
  } =
    useBusinesses();

  const {
    data: stores = [],
  } =
    useStores(
      businessId
    );

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    storeId,
    setStoreId,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState<
      "" | CardStatus
    >("");

  const [
    detailsCard,
    setDetailsCard,
  ] =
    useState<
      ReviewCard | null
    >(null);

  const [
    editingCard,
    setEditingCard,
  ] =
    useState<
      ReviewCard | null
    >(null);

  useEffect(() => {
    setPage(1);
    setStoreId("");
    setStatus("");
  }, [
    businessId,
  ]);

  const filters =
    useMemo(
      () => ({
        page,
        limit: 9,

        businessId:
          businessId ??
          undefined,

        storeId:
          storeId ||
          undefined,

        status:
          status ||
          undefined,
      }),
      [
        page,
        businessId,
        storeId,
        status,
      ]
    );

  const {
    data,
    isLoading,
  } =
    useCards(
      filters,
      Boolean(
        businessId
      )
    );

  const selectedBusiness =
    businesses.find(
      (business) =>
        business.id ===
        businessId
    );

  if (!businessId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <Radio className="mx-auto size-8 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">
            Select a business
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Choose a business
            before viewing its
            review cards.
          </p>
        </div>
      </div>
    );
  }

  const cards =
    data?.cards ??
    [];

  const pagination =
    data?.pagination;

  return (
    <>
      <div className="space-y-7">
        {/* Heading */}
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {
              selectedBusiness
                ?.name
            }
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Review Cards
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            View your active
            physical cards,
            interaction activity
            and permanent NFC / QR
            links.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/60 p-3 sm:flex-row">
          <div className="sm:w-60">
            <NativeSelect
              value={
                storeId
              }
              onChange={(
                event
              ) => {
                setStoreId(
                  event
                    .currentTarget
                    .value
                );

                setPage(1);
              }}
            >
              <NativeSelectOption value="">
                All locations
              </NativeSelectOption>

              {stores.map(
                (store) => (
                  <NativeSelectOption
                    key={
                      store.id
                    }
                    value={
                      store.id
                    }
                  >
                    {
                      store.name
                    }
                  </NativeSelectOption>
                )
              )}
            </NativeSelect>
          </div>

          <div className="sm:w-48">
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
                All statuses
              </NativeSelectOption>

              <NativeSelectOption value="ACTIVE">
                Active
              </NativeSelectOption>

              <NativeSelectOption value="INACTIVE">
                Inactive
              </NativeSelectOption>
            </NativeSelect>
          </div>

          <div className="ml-auto flex items-center px-2 text-sm text-muted-foreground">
            {pagination
              ?.total ??
              0}{" "}
            cards
          </div>
        </div>

        {/* Data */}
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <Skeleton
                  key={
                    index
                  }
                  className="aspect-[1/1.05] rounded-2xl"
                />
              )
            )}
          </div>
        ) : cards.length ===
          0 ? (
          <CardsEmpty />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {cards.map(
                (card) => (
                  <ReviewCardItem
                    key={
                      card.id
                    }
                    card={
                      card
                    }
                    onDetails={() =>
                      setDetailsCard(
                        card
                      )
                    }
                    onEdit={() =>
                      setEditingCard(
                        card
                      )
                    }
                  />
                )
              )}
            </div>

            {pagination &&
              pagination.totalPages >
                1 && (
                <div className="flex items-center justify-between border-t border-border/60 pt-5">
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
          </>
        )}
      </div>

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

      <EditCardDialog
        card={
          editingCard
        }
        open={
          Boolean(
            editingCard
          )
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setEditingCard(
              null
            );
          }
        }}
      />
    </>
  );
}

function CardsEmpty() {
  return (
    <div className="flex min-h-[48vh] items-center justify-center rounded-2xl border border-dashed border-border">
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <CreditCard className="size-6 text-emerald-500" />
        </div>

        <h3 className="mt-5 text-xl font-semibold">
          No review cards assigned
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          No physical ValYou
          cards are currently
          assigned to this
          business. Cards will
          appear here once the
          ValYou team activates
          and assigns them to your
          locations.
        </p>
      </div>
    </div>
  );
}