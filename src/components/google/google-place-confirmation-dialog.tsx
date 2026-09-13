"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Loader2,
  MapPin,
} from "lucide-react";

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
  cn,
} from "@/lib/utils";

import type {
  GoogleConnectionCandidate,
} from "@/types/google-reputation";

type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  candidates:
    GoogleConnectionCandidate[];

  isSubmitting:
    boolean;

  onConfirm: (
    placeId: string
  ) => void;
};

export function GooglePlaceConfirmationDialog({
  open,
  onOpenChange,
  candidates,
  isSubmitting,
  onConfirm,
}: Props) {
  const [
    selectedPlaceId,
    setSelectedPlaceId,
  ] =
    useState("");

  useEffect(() => {
    if (!open) {
      setSelectedPlaceId(
        ""
      );

      return;
    }

    /*
     * If ValYou found exactly
     * one candidate, select it
     * automatically.
     */
    if (
      candidates.length ===
      1
    ) {
      setSelectedPlaceId(
        candidates[0]
          .placeId
      );

      return;
    }

    setSelectedPlaceId(
      ""
    );
  }, [
    open,
    candidates,
  ]);

  const singleCandidate =
    candidates.length ===
    1;

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
            {singleCandidate
              ? "Confirm Google Business"
              : "Choose your Google Business"}
          </DialogTitle>

          <DialogDescription>
            {singleCandidate
              ? "ValYou found this Google Business. Confirm that it belongs to this location."
              : "ValYou found a few possible Google Businesses. Choose the one that matches this location."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {candidates.map(
            (
              candidate
            ) => {
              const selected =
                selectedPlaceId ===
                candidate.placeId;

              return (
                <button
                  key={
                    candidate.placeId
                  }
                  type="button"
                  disabled={
                    isSubmitting
                  }
                  onClick={() =>
                    setSelectedPlaceId(
                      candidate.placeId
                    )
                  }
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors",

                    selected
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",

                      selected
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {selected ? (
                      <Check className="size-4" />
                    ) : (
                      <MapPin className="size-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium">
                      {
                        candidate.name
                      }
                    </p>

                    {candidate.address && (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {
                          candidate.address
                        }
                      </p>
                    )}
                  </div>
                </button>
              );
            }
          )}
        </div>

        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            None of these match?
            Check the location name,
            address and Google Review
            URL in ValYou, then try
            connecting again.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={
              isSubmitting
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
              !selectedPlaceId ||
              isSubmitting
            }
            onClick={() =>
              onConfirm(
                selectedPlaceId
              )
            }
          >
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Confirm & connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}