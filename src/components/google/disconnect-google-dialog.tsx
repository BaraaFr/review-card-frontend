"use client";

import {
  Loader2,
  Unlink,
} from "lucide-react";

import {
  useState,
} from "react";

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
  useDisconnectGooglePlace,
} from "@/hooks/google/use-disconnect-google-place";

import type {
  Store,
} from "@/types/business";

type Props = {
  store: Store;

  size?:
    | "default"
    | "sm"
    | "lg"
    | "icon";
};

export function DisconnectGoogleDialog({
  store,
  size = "sm",
}: Props) {
  const [
    open,
    setOpen,
  ] =
    useState(false);

  const disconnectMutation =
    useDisconnectGooglePlace();

  async function handleDisconnect() {
    try {
      await disconnectMutation.mutateAsync(
        store.id
      );

      toast.success(
        "Google Business disconnected."
      );

      setOpen(false);
    } catch (
      error: any
    ) {
      const message =
        error?.response
          ?.data?.message ??
        "Unable to disconnect Google Business.";

      toast.error(
        message
      );
    }
  }

  return (
    <>
      <Button
        type="button"
        size={size}
        variant="ghost"
        onClick={() =>
          setOpen(true)
        }
      >
        <Unlink className="size-4" />

        Disconnect
      </Button>

      <Dialog
        open={open}
        onOpenChange={(
          nextOpen
        ) => {
          if (
            disconnectMutation.isPending
          ) {
            return;
          }

          setOpen(
            nextOpen
          );
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Disconnect Google
              Business?
            </DialogTitle>

            <DialogDescription>
            ValYou will stop
              showing Google rating
              and reviews for{" "}
              <span className="font-medium text-foreground">
                {store.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Your Google Review URL
              will not be deleted.
              NFC and QR cards will
              continue sending
              customers to the same
              Google review page.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={
                disconnectMutation.isPending
              }
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={
                disconnectMutation.isPending
              }
              onClick={
                handleDisconnect
              }
            >
              {disconnectMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Unlink className="size-4" />
              )}

              {disconnectMutation.isPending
                ? "Disconnecting..."
                : "Disconnect Google"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}