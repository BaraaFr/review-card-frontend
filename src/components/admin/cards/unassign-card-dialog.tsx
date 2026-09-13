"use client";

import {
  Loader2,
  Unlink,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  ReviewCard,
} from "@/types/card";

import {
  useUnassignCard,
} from "@/hooks/cards/use-card";

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

export function UnassignCardDialog({
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
  const unassign =
    useUnassignCard();

  if (!card) {
    return null;
  }

  const confirm =
    async () => {
      try {
        await unassign
          .mutateAsync(
            card.id
          );

        toast.success(
          "Card returned to inventory"
        );

        onOpenChange(
          false
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to unassign card"
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
            Return card to
            inventory?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This removes the card
            from{" "}
            {card.store
              ?.name ??
              "its current location"}
            . Existing historical
            interaction data will
            remain intact.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
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
            variant="destructive"
            disabled={
              unassign.isPending
            }
            onClick={
              confirm
            }
          >
            {unassign.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Unlink className="size-4" />
            )}

            Unassign card
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}