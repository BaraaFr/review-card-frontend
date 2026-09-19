"use client";

import {
  useRef,
  useState,
} from "react";

import {
  Loader2,
  PackageCheck,
} from "lucide-react";

import axios from "axios";

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
  Input,
} from "@/components/ui/input";

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

  open:
    boolean;

  onOpenChange:
    (
      open:
        boolean
    ) => void;
}

type ApiError = {
  message?:
    string;

  code?:
    string;
};

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

  const [
    receiptReference,
    setReceiptReference,
  ] =
    useState("");

  /*
   * Additional protection against
   * extremely fast repeated submits
   * before React has rendered the
   * mutation pending state.
   */
  const busy =
    useRef(false);

  const deliverCard =
    useDeliverCard();

  const resetForm =
    () => {
      setPaymentMethod(
        "CASH"
      );

      setReceiptReference(
        ""
      );

      busy.current =
        false;
    };

  const handleOpenChange =
    (
      nextOpen:
        boolean
    ) => {
      if (
        deliverCard.isPending
      ) {
        return;
      }

      if (
        !nextOpen
      ) {
        resetForm();
      }

      onOpenChange(
        nextOpen
      );
    };

  const handleConfirm =
    async () => {
      if (
        !card ||
        busy.current
      ) {
        return;
      }

      const normalizedReceipt =
        receiptReference
          .trim()
          .toUpperCase();

      if (
        normalizedReceipt
          .length <
        3
      ) {
        toast.error(
          "Enter a valid receipt or transaction reference"
        );

        return;
      }

      busy.current =
        true;

      try {
        await deliverCard
          .mutateAsync({
            cardId:
              card.id,

            paymentMethod,

            receiptReference:
              normalizedReceipt,
          });

        toast.success(
          "Card delivered and payment recorded"
        );

        resetForm();

        onOpenChange(
          false
        );
      } catch (error) {
        console.error(
          error
        );

        if (
          axios.isAxiosError<ApiError>(
            error
          )
        ) {
          toast.error(
            error.response
              ?.data
              ?.message ??
              "Connection interrupted. Check the payment history, then retry using the same receipt reference."
          );

          return;
        }

        toast.error(
          "Unable to record card delivery"
        );
      } finally {
        busy.current =
          false;
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={
        handleOpenChange
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
                disabled={
                  deliverCard
                    .isPending
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

            <div className="space-y-2">
              <Label
                htmlFor="delivery-receipt-reference"
              >
                Receipt / transaction reference
              </Label>

              <Input
                id="delivery-receipt-reference"
                value={
                  receiptReference
                }
                disabled={
                  deliverCard
                    .isPending
                }
                minLength={
                  3
                }
                maxLength={
                  100
                }
                placeholder={
                  paymentMethod ===
                  "WHISH"
                    ? "Whish transaction reference"
                    : paymentMethod ===
                        "CASH"
                      ? "Cash receipt number"
                      : "Payment reference"
                }
                onChange={(
                  event
                ) =>
                  setReceiptReference(
                    event
                      .target
                      .value
                  )
                }
              />

              <p className="text-xs text-muted-foreground">
                Use a unique
                reference for every
                payment. The same
                reference cannot be
                recorded twice.
              </p>
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
              handleOpenChange(
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
                .isPending ||
              receiptReference
                .trim()
                .length <
                3
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