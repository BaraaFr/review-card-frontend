"use client";

import {
  useState,
} from "react";

import {
  Check,
  Copy,
  KeyRound,
} from "lucide-react";

import {
  format,
  parseISO,
} from "date-fns";

import {
  toast,
} from "sonner";

import type {
  ActivationResult,
} from "@/types/customer";

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

type Props = {
  result:
    | ActivationResult
    | null;

  customerName?: string;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
};

export function ActivationLinkDialog({
  result,
  customerName,
  open,
  onOpenChange,
}: Props) {
  const [
    copied,
    setCopied,
  ] =
    useState(false);

  if (!result) {
    return null;
  }

  const copyLink =
    async () => {
      try {
        await navigator
          .clipboard
          .writeText(
            result.activationUrl
          );

        setCopied(true);

        toast.success(
          "Activation link copied"
        );

        setTimeout(
          () =>
            setCopied(false),
          1500
        );
      } catch {
        toast.error(
          "Unable to copy activation link"
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10">
            <KeyRound className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <DialogTitle>
            Activation link ready
          </DialogTitle>

          <DialogDescription>
            Send this link to{" "}
            {customerName ??
              "the customer"}{" "}
            so they can create their
            password and activate
            their ValYou account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Activation URL
            </p>

            <div className="mt-3 flex gap-2">
              <code className="min-w-0 flex-1 break-all rounded-xl bg-background px-3 py-3 text-xs">
                {
                  result.activationUrl
                }
              </code>

              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={
                  copyLink
                }
              >
                {copied ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-xs leading-5 text-muted-foreground">
            This link expires on{" "}
            <strong className="text-foreground">
              {format(
                parseISO(
                  result.activationExpiresAt
                ),
                "MMM d, yyyy 'at' h:mm a"
              )}
            </strong>
            . Generating a new link
            invalidates the previous
            one.
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            For V1 you can copy this
            link and send it through
            WhatsApp, email or SMS.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(
                false
              )
            }
          >
            Done
          </Button>

          <Button
            type="button"
            onClick={
              copyLink
            }
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}

            Copy activation link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}