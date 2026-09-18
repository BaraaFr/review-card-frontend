"use client";

import {
  useSubscriptionUsage,
} from "@/hooks/subscriptions/use-subscription";

import {
  ManageSubscriptionDialog,
} from "./manage-subscription-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Skeleton,
} from "@/components/ui/skeleton";

type Props = {
  businessId: string;

  businessName: string;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
};

export function BusinessSubscriptionDialog({
  businessId,
  businessName,
  open,
  onOpenChange,
}: Props) {
  const {
    data,
    isLoading,
  } =
    useSubscriptionUsage(
      open
        ? businessId
        : null
    );

  if (
    open &&
    isLoading
  ) {
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
              Manage subscription
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />

            <Skeleton className="h-10 w-full" />

            <Skeleton className="h-10 w-full" />

            <Skeleton className="h-10 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <ManageSubscriptionDialog
      businessId={
        businessId
      }
      businessName={
        businessName
      }
      open={open}
      onOpenChange={
        onOpenChange
      }
    />
  );
}