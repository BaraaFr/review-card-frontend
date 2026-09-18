"use client";

import {
  CheckCircle2,
  ExternalLink,
  Link2,
  TriangleAlert,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  ConnectGoogleButton,
} from "@/components/google/connect-google-button";

import {
  DisconnectGoogleDialog,
} from "@/components/google/disconnect-google-dialog";

import type {
  Store,
} from "@/types/business";

type Props = {
  store: Store;
};

export function LocationGoogleConnection({
  store,
}: Props) {
  const connected =
    Boolean(
      store.googlePlaceId &&
      store.googleReviewUrl &&
      store.googlePlaceConnectedFromUrl ===
        store.googleReviewUrl
    );

  const reconnectRequired =
    Boolean(
      store.googlePlaceId &&
      store.googleReviewUrl &&
      store.googlePlaceConnectedFromUrl !==
        store.googleReviewUrl
    );

  /*
   * --------------------------------
   * No Google Review URL
   * --------------------------------
   */
  if (
    !store.googleReviewUrl
  ) {
    return (
      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Link2 className="size-4 text-muted-foreground" />

              <p className="font-medium">
                Google Business
              </p>

              <Badge variant="outline">
                Not configured
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Add this location&apos;s
              Google Review URL before
              connecting Google
              Reputation.
            </p>
          </div>

          <ConnectGoogleButton
            store={store}
            size="sm"
          />
        </div>
      </div>
    );
  }

  /*
   * --------------------------------
   * Google Review URL changed
   * --------------------------------
   */
  if (
    reconnectRequired
  ) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-amber-500" />

              <p className="font-medium">
                Google Business
              </p>

              <Badge variant="outline">
                Reconnect required
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              The Google Review URL
              changed. Reconnect Google
              so ValYou displays
              reputation data for the
              correct business.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ConnectGoogleButton
              store={store}
              size="sm"
            />

            <DisconnectGoogleDialog
              store={store}
              size="sm"
            />
          </div>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------
   * Connected
   * --------------------------------
   */
  if (
    connected
  ) {
    return (
      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />

              <p className="font-medium">
                Google Business
              </p>

              <Badge variant="secondary">
                Connected
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Google Reputation is
              connected to this
              location.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                window.open(
                  store.googleReviewUrl!,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <ExternalLink className="size-4" />

              Review page
            </Button>

            <DisconnectGoogleDialog
              store={store}
              size="sm"
            />
          </div>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------
   * Review URL exists but
   * Google Reputation is not
   * connected
   * --------------------------------
   */
  return (
    <div className="rounded-xl border border-dashed   p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="size-4 text-muted-foreground" />

            <p className="font-medium">
              Google Business
            </p>

            <Badge variant="outline">
              Not connected
            </Badge>
          </div>

          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            ValYou will identify
            the Google Business from
            this location&apos;s review
            URL, name and address.
            You&apos;ll confirm the
            business when necessary.
          </p>
        </div>

        <ConnectGoogleButton
          store={store}
          size="sm"
        />
      </div>
    </div>
  );
}