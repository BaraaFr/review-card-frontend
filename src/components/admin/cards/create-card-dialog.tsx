"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Plus,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useCreateCard,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateCardDialog({
  open,
  onOpenChange,
}: {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
}) {
  const create =
    useCreateCard();

  const [
    label,
    setLabel,
  ] =
    useState("");

  useEffect(() => {
    if (open) {
      setLabel("");
    }
  }, [open]);

  const submit =
    async () => {
      try {
        await create
          .mutateAsync({
            label:
              label.trim() ||
              null,
          });

        toast.success(
          "Inventory card created"
        );

        onOpenChange(
          false
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to create card"
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create inventory card
          </DialogTitle>

          <DialogDescription>
            Generate a permanent
            card code, NFC URL and
            dynamic QR destination.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="inventory-label">
            Internal label
          </Label>

          <Input
            id="inventory-label"
            value={label}
            onChange={(
              event
            ) =>
              setLabel(
                event.target
                  .value
              )
            }
            placeholder="Optional — Batch A"
          />

          <p className="text-xs text-muted-foreground">
            You can rename the card
            when it is assigned to a
            customer.
          </p>
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
              create.isPending
            }
            onClick={
              submit
            }
          >
            {create.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}

            Create card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}