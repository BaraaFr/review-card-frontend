"use client";

import {
  useState,
} from "react";

import {
  ExternalLink,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  Store,
} from "@/types/business";

import {
  useStores,
} from "@/hooks/stores/use-store";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import {
  AddLocationDialog,
} from "./add-location-dialog";
import { DeleteStoreDialog } from "@/components/locations/delete-store-dialog";


type Props = {
  businessId: string;

  businessName: string;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
};

export function ManageLocationsDialog({
  businessId,
  businessName,
  open,
  onOpenChange,
}: Props) {
  const {
    data: stores = [],
    isLoading,
  } =
    useStores(
      open
        ? businessId
        : null
    );

  const [
    addOpen,
    setAddOpen,
  ] =
    useState(false);

  const [
    deleteStore,
    setDeleteStore,
  ] =
    useState<
      Store | null
    >(null);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={
          onOpenChange
        }
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Manage locations
            </DialogTitle>

            <DialogDescription>
              Add or remove locations
              for {businessName}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={() =>
                setAddOpen(
                  true
                )
              }
            >
              <Plus className="size-4" />

              Add location
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : stores.length ===
            0 ? (
            <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-border">
              <div className="text-center">
                <MapPin className="mx-auto size-8 text-muted-foreground/50" />

                <p className="mt-3 font-medium">
                  No locations
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add the first
                  location for this
                  business.
                </p>

                <Button
                  size="sm"
                  className="mt-5"
                  onClick={() =>
                    setAddOpen(
                      true
                    )
                  }
                >
                  <Plus className="size-4" />

                  Add location
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {stores.map(
                (store) => (
                  <LocationRow
                    key={
                      store.id
                    }
                    store={
                      store
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
        </DialogContent>
      </Dialog>

      <AddLocationDialog
        businessId={
          businessId
        }
        businessName={
          businessName
        }
        open={
          addOpen
        }
        onOpenChange={
          setAddOpen
        }
      />

      <DeleteStoreDialog
        store={
          deleteStore
        }
        open={
          Boolean(
            deleteStore
          )
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setDeleteStore(
              null
            );
          }
        }}
      />
    </>
  );
}

function LocationRow({
  store,
  onDelete,
}: {
  store: Store;

  onDelete:
    () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/70 p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <MapPin className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="min-w-0">
          <p className="font-medium">
            {store.name}
          </p>

          {store.address && (
            <p className="mt-1 text-xs text-muted-foreground">
              {
                store.address
              }
            </p>
          )}

          {store.googleReviewUrl ? (
            <a
              href={
                store.googleReviewUrl
              }
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <ExternalLink className="size-3" />

              Google Review URL
            </a>
          ) : (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              Missing Google Review
              URL
            </p>
          )}
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={
          onDelete
        }
      >
        <Trash2 className="size-4" />

        Remove
      </Button>
    </div>
  );
}