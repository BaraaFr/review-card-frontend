"use client";

import {
  CheckCircle2,
  Link2,
  Loader2,
  RefreshCw,
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
  GooglePlaceConfirmationDialog,
} from "@/components/google/google-place-confirmation-dialog";

import {
  useConfirmGooglePlace,
} from "@/hooks/google/use-confirm-google-place";

import {
  useConnectGooglePlace,
} from "@/hooks/google/use-connect-google-place";

import type {
  GoogleConfirmationRequiredResult,
} from "@/types/google-reputation";

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

  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive";
};

function getErrorMessage(
  error: any
) {
  const code =
    error?.response
      ?.data?.code;

  switch (code) {
    case "GOOGLE_REVIEW_URL_REQUIRED":
      return "Add the Google Review URL first.";

    case "INVALID_GOOGLE_REVIEW_URL":
      return "The Google Review URL is invalid.";

    case "GOOGLE_PLACE_SEARCH_FAILED":
      return "Google Business search is temporarily unavailable.";

    case "GOOGLE_PLACE_FETCH_FAILED":
      return "Google Business information is temporarily unavailable.";

    case "GOOGLE_CONFIRMATION_EXPIRED":
      return "The confirmation expired. Connect Google again.";

    case "GOOGLE_CONFIRMATION_STALE":
      return "The Google Review URL changed. Connect Google again.";

    case "GOOGLE_PLACE_NOT_ALLOWED":
      return "This Google Business can't be connected from the current confirmation.";

    default:
      return (
        error?.response
          ?.data?.message ??
        "Unable to connect Google Business."
      );
  }
}

export function ConnectGoogleButton({
  store,
  size = "default",
  variant,
}: Props) {
  const connectMutation =
    useConnectGooglePlace();

  const confirmMutation =
    useConfirmGooglePlace();

  const [
    confirmation,
    setConfirmation,
  ] =
    useState<
      GoogleConfirmationRequiredResult | null
    >(null);

  const isConnected =
    Boolean(
      store.googlePlaceId &&
      store.googleReviewUrl &&
      store.googlePlaceConnectedFromUrl ===
        store.googleReviewUrl
    );

  const needsReconnect =
    Boolean(
      store.googlePlaceId &&
      store.googleReviewUrl &&
      store.googlePlaceConnectedFromUrl !==
        store.googleReviewUrl
    );

  const isPending =
    connectMutation.isPending ||
    confirmMutation.isPending;

  async function handleConnect() {
    try {
      const result =
        await connectMutation.mutateAsync(
          store.id
        );

      if (
        result.status ===
        "CONNECTED"
      ) {
        toast.success(
          result.googlePlace
            .name
            ? `${result.googlePlace.name} connected to Google.`
            : "Google Business connected."
        );

        return;
      }

      if (
        result.status ===
        "NOT_FOUND"
      ) {
        toast.error(
          "ValYou couldn't find a matching Google Business. Check the business name, address and Google Review URL."
        );

        return;
      }

      if (
        result.status ===
        "CONFIRMATION_REQUIRED"
      ) {
        setConfirmation(
          result
        );
      }
    } catch (error) {
      toast.error(
        getErrorMessage(
          error
        )
      );
    }
  }

  async function handleConfirm(
    placeId: string
  ) {
    if (!confirmation) {
      return;
    }

    try {
      const result =
        await confirmMutation.mutateAsync(
          {
            storeId:
              store.id,

            placeId,

            confirmationToken:
              confirmation
                .confirmationToken,
          }
        );

      toast.success(
        result.googlePlace
          .name
          ? `${result.googlePlace.name} connected to Google.`
          : "Google Business connected."
      );

      setConfirmation(
        null
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error
        )
      );
    }
  }

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={
          variant ??
          (
            isConnected
              ? "outline"
              : "default"
          )
        }
        disabled={
          isPending ||
          !store.googleReviewUrl ||
          isConnected
        }
        onClick={
          handleConnect
        }
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isConnected ? (
          <CheckCircle2 className="size-4 text-emerald-500" />
        ) : needsReconnect ? (
          <RefreshCw className="size-4" />
        ) : (
          <Link2 className="size-4" />
        )}

        {isPending
          ? "Connecting..."
          : isConnected
            ? "Google connected"
            : needsReconnect
              ? "Reconnect Google"
              : "Connect Google"}
      </Button>

      {confirmation && (
        <GooglePlaceConfirmationDialog
          open={
            true
          }
          onOpenChange={(
            open
          ) => {
            if (
              !open &&
              !confirmMutation.isPending
            ) {
              setConfirmation(
                null
              );
            }
          }}
          candidates={
            confirmation.candidates
          }
          isSubmitting={
            confirmMutation.isPending
          }
          onConfirm={
            handleConfirm
          }
        />
      )}
    </>
  );
}