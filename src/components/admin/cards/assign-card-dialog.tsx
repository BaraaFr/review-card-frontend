"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  MapPin,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  ReviewCard,
} from "@/types/card";

import {
  useBusinesses,
} from "@/hooks/business/use-businesses";

import {
  useStores,
} from "@/hooks/stores/use-store";

import {
  useAssignCard,
} from "@/hooks/cards/use-card";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AssignCardDialog({
  card,
  open,
  onOpenChange,
}: {
  card:
    | ReviewCard
    | null;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
}) {
  const {
    data: businesses = [],
  } =
    useBusinesses();

  const [
    businessId,
    setBusinessId,
  ] =
    useState("");

  const [
    storeId,
    setStoreId,
  ] =
    useState("");

  const [
    label,
    setLabel,
  ] =
    useState("");

  const {
    data: stores = [],
    isLoading:
      storesLoading,
  } =
    useStores(
      businessId ||
        null
    );

  const assign =
    useAssignCard();

  useEffect(() => {
    if (!open) {
      return;
    }

    setBusinessId("");
    setStoreId("");

    setLabel(
      card?.label ??
        ""
    );
  }, [
    open,
    card,
  ]);

  if (!card) {
    return null;
  }

  const eligibleStores =
    stores.filter(
      (store) =>
        Boolean(
          store
            .googleReviewUrl
        )
    );

  const submit =
    async () => {
      if (!storeId) {
        toast.error(
          "Select a location"
        );

        return;
      }

      try {
        await assign
          .mutateAsync({
            cardId:
              card.id,

            payload: {
              storeId,

              ...(label.trim()
                ? {
                    label:
                      label.trim(),
                  }
                : {}),
            },
          });

        toast.success(
          "Card assigned"
        );

        onOpenChange(
          false
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to assign card"
          )
        );
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Assign card
          </DialogTitle>

          <DialogDescription>
            Connect this physical
            card to a business
            location.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">
              Card code
            </p>

            <p className="mt-1 font-mono text-sm font-medium">
              {card.code}
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Business
            </Label>

            <NativeSelect
              value={
                businessId
              }
              onChange={(
                event
              ) => {
                setBusinessId(
                  event
                    .currentTarget
                    .value
                );

                setStoreId("");
              }}
            >
              <NativeSelectOption value="">
                Select business
              </NativeSelectOption>

              {businesses.map(
                (
                  business
                ) => (
                  <NativeSelectOption
                    key={
                      business.id
                    }
                    value={
                      business.id
                    }
                  >
                    {
                      business.name
                    }
                  </NativeSelectOption>
                )
              )}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>
              Location
            </Label>

            <NativeSelect
              value={
                storeId
              }
              disabled={
                !businessId ||
                storesLoading
              }
              onChange={(
                event
              ) =>
                setStoreId(
                  event
                    .currentTarget
                    .value
                )
              }
            >
              <NativeSelectOption value="">
                {storesLoading
                  ? "Loading locations..."
                  : "Select location"}
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
                    disabled={
                      !store
                        .googleReviewUrl
                    }
                  >
                    {store.name}
                    {!store
                      .googleReviewUrl
                      ? " — needs review URL"
                      : ""}
                  </NativeSelectOption>
                )
              )}
            </NativeSelect>

            {businessId &&
              !storesLoading &&
              eligibleStores.length ===
                0 && (
                <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <MapPin className="size-3.5" />

                  This business has
                  no location ready
                  for card
                  assignment.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-label">
              Placement label
            </Label>

            <Input
              id="assign-label"
              value={label}
              onChange={(
                event
              ) =>
                setLabel(
                  event.target
                    .value
                )
              }
              placeholder="Cashier"
            />

            <p className="text-xs text-muted-foreground">
              Describe where this
              physical card will be
              placed.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            disabled={
              !storeId ||
              assign.isPending
            }
            onClick={
              submit
            }
          >
            {assign.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Assign card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}