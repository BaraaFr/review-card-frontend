"use client";

import {
  Loader2,
  Trash2,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  Store,
} from "@/types/business";

import {
  useDeleteStore,
} from "@/hooks/stores/use-store";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

import {
  Button,
} from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  store:
    | Store
    | null;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
};

export function DeleteStoreDialog({
  store,
  open,
  onOpenChange,
}: Props) {
  const remove =
    useDeleteStore();

  const handleDelete =
    async () => {
      if (!store) {
        return;
      }

      try {
        await remove.mutateAsync(
          store.id
        );

        toast.success(
          "Location deleted"
        );

        onOpenChange(false);
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to delete location"
          )
        );
      }
    };

  return (
    <AlertDialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete{" "}
            {store?.name}?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be
            undone. Locations with
            cards or interaction
            history cannot be
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            type="button"
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
            type="button"
            variant="destructive"
            disabled={
              remove.isPending
            }
            onClick={
              handleDelete
            }
          >
            {remove.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}

            Delete location
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}