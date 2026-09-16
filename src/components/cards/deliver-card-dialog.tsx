"use client";

import {
  useState,
} from "react";

import {
  Loader2,
  PackageCheck,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Label,
} from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useDeliverCard,
} from "@/hooks/cards/use-card";

import type {
  CardPaymentMethod,
  ReviewCard,
} from "@/types/card";

interface DeliverCardDialogProps {
  card:
    | ReviewCard
    | null;

  open: boolean;

  onOpenChange:
    (
      open: boolean
    ) => void;
}

export function DeliverCardDialog({
  card,
  open,
  onOpenChange,
}: DeliverCardDialogProps) {
  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<CardPaymentMethod>(
      "CASH"
    );

  const deliverCard =
    useDeliverCard();

  const handleConfirm =
    async () => {
      if (!card) {
        return;
      }

      try {
        await deliverCard
          .mutateAsync({
            cardId:
              card.id,

            paymentMethod,
          });

        toast.success(
          "Card marked as delivered and paid"
        );

        onOpenChange(
          false
        );
      } catch (error) {
        console.error(
          error
        );

        toast.error(
          "Unable to deliver card"
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
            Deliver ValYou card
          </DialogTitle>

          <DialogDescription>
            Confirm that the
            physical card was
            delivered and the
            $10 card fee was
            collected.
          </DialogDescription>
        </DialogHeader>

        {card && (
          <div className="space-y-5 py-2">
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <PackageCheck className="size-5" />
                </div>

                <div>
                  <p className="font-medium">
                    {card.label ||
                      card.code}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Card & setup:
                    {" "}
                    <strong className="text-foreground">
                      $10.00
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Payment method
              </Label>

              <Select
                value={
                  paymentMethod
                }
                onValueChange={(
                  value
                ) =>
                  setPaymentMethod(
                    value as CardPaymentMethod
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="CASH">
                    Cash
                  </SelectItem>

                  <SelectItem value="WHISH">
                    Whish
                  </SelectItem>

                  <SelectItem value="OTHER">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={
              deliverCard
                .isPending
            }
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
            disabled={
              !card ||
              deliverCard
                .isPending
            }
            onClick={
              handleConfirm
            }
          >
            {deliverCard
              .isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Confirm delivery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}