"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  ExternalLink,
  Lock,
  RefreshCw,
  Star,
} from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";

import { Button, buttonVariants } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { useGoogleReputation } from "@/hooks/google/use-google-reputation";

import { cn } from "@/lib/utils";

import type { Store } from "@/types/business";
import Image from "next/image";

/*
 * Owner can manually request fresh
 * Google data once every 10 minutes.
 *
 * This is UX protection and cost
 * protection.
 */
const MANUAL_REFRESH_COOLDOWN_MS = 10 * 60 * 1000;

type Props = {
  store: Store;

  hasAnalyticsAccess: boolean;
};

function getRefreshStorageKey(storeId: string) {
  return `valyou:google-reputation:last-manual-refresh:${storeId}`;
}

function RatingStars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-4",

            index < rounded
              ? "fill-current text-amber-500"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

function ReputationLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-44" />

        <Skeleton className="h-4 w-64" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 w-full" />

          <Skeleton className="h-24 w-full" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />

          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function formatLastChecked(timestamp: number) {
  if (!timestamp) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",

    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatCooldown(milliseconds: number) {
  const minutes = Math.ceil(milliseconds / 60_000);

  if (minutes <= 1) {
    return "less than a minute";
  }

  return `${minutes} minutes`;
}

export function GoogleReputationCard({ store, hasAnalyticsAccess }: Props) {
  const validConnection = Boolean(
    store.googlePlaceId &&
      store.googleReviewUrl &&
      store.googlePlaceConnectedFromUrl === store.googleReviewUrl
  );

  const reputation = useGoogleReputation(
    store.id,

    hasAnalyticsAccess && validConnection
  );

  /*
   * --------------------------------------------------
   * Manual refresh cooldown
   * --------------------------------------------------
   */

  const [lastManualRefreshAt, setLastManualRefreshAt] = useState(0);
  const now = Date.now();
  const [currentTime, setCurrentTime] = useState(now);

  useEffect(() => {
    const stored = window.localStorage.getItem(getRefreshStorageKey(store.id));

    if (stored) {
      const timestamp = Number(stored);

      if (Number.isFinite(timestamp)) {
        setLastManualRefreshAt(timestamp);
      }
    }
  }, [store.id]);

  /*
   * Only tick while the cooldown
   * is relevant.
   *
   * 30 seconds is plenty.
   */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const nextRefreshAt = lastManualRefreshAt + MANUAL_REFRESH_COOLDOWN_MS;

  const remainingCooldown = Math.max(
    0,

    nextRefreshAt - currentTime
  );

  const refreshAvailable = remainingCooldown === 0;

  /*
   * React Query tells us when
   * the latest successful request
   * completed.
   */
  const lastCheckedLabel = useMemo(
    () => formatLastChecked(reputation.dataUpdatedAt),

    [reputation.dataUpdatedAt]
  );

  async function handleManualRefresh() {
    if (!refreshAvailable || reputation.isFetching) {
      return;
    }

    const previousReviewCount = reputation.data?.reviewCount ?? 0;

    const previousRating = reputation.data?.rating ?? null;

    try {
      /*
       * refetch() ignores staleTime
       * and makes an intentional
       * fresh request.
       */
      const result = await reputation.refetch();

      if (result.error) {
        throw result.error;
      }

      const refreshedAt = Date.now();

      setLastManualRefreshAt(refreshedAt);

      setCurrentTime(refreshedAt);

      /*
       * Persist ONLY our own
       * refresh timestamp.
       *
       * We are NOT storing Google
       * review/rating content here.
       */
      window.localStorage.setItem(
        getRefreshStorageKey(store.id),

        String(refreshedAt)
      );

      const newReviewCount = result.data?.reviewCount ?? 0;

      const newRating = result.data?.rating ?? null;

      const reviewCountChanged = newReviewCount !== previousReviewCount;

      const ratingChanged = newRating !== previousRating;

      if (reviewCountChanged || ratingChanged) {
        toast.success("Google reputation updated.");

        return;
      }

      toast.info(
        "No newer Google data is available yet. New reviews can take time to appear after Google processes them."
      );
    } catch (error) {
      console.error("Google reputation refresh failed:", error);

      /*
       * Failed requests do not
       * start the cooldown.
       */
      toast.error("Google reputation couldn't be refreshed. Please try again.");
    }
  }

  /*
   * --------------------------------------------------
   * Subscription locked
   * --------------------------------------------------
   */

  if (!hasAnalyticsAccess) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Lock className="size-5 text-muted-foreground" />
            </div>

            <div>
              <CardTitle>Google Reputation</CardTitle>

              <CardDescription className="mt-1">
                Reputation analytics require an active subscription.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-dashed p-5">
            <p className="text-sm text-muted-foreground">
              Google reputation data is locked while this business does not have
              an active subscription.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /*
   * --------------------------------------------------
   * Not connected
   * --------------------------------------------------
   */

  if (!validConnection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Reputation</CardTitle>

          <CardDescription>
            Connect this location to Google before viewing its reputation.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  /*
   * --------------------------------------------------
   * Initial loading
   * --------------------------------------------------
   */

  if (reputation.isLoading) {
    return <ReputationLoading />;
  }

  /*
   * --------------------------------------------------
   * Error
   * --------------------------------------------------
   */

  if (reputation.isError) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>

            <div>
              <CardTitle>Google Reputation</CardTitle>

              <CardDescription className="mt-1">
                Google reputation couldn't be loaded.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            variant="outline"
            disabled={reputation.isFetching}
            onClick={() => reputation.refetch()}
          >
            <RefreshCw
              className={cn(
                "size-4",

                reputation.isFetching && "animate-spin"
              )}
            />
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const data = reputation.data;

  if (!data || !data.connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Reputation</CardTitle>

          <CardDescription>
            {data?.reason === "RECONNECT_REQUIRED"
              ? "The Google Review URL changed. Reconnect this location to Google."
              : "Google isn't connected to this location."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const rating = data.rating ?? null;

  const reviewCount = data.reviewCount ?? 0;

  const reviews = data.reviews ?? [];

  return (
    <Card>
      {/*
       * ------------------------------------------------
       * Header
       * ------------------------------------------------
       */}
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Google Reputation</CardTitle>

              <Badge variant="secondary">Google Maps</Badge>
            </div>

            <CardDescription className="mt-1">
              {data.businessName ?? store.name}

              {data.address ? ` · ${data.address}` : ""}
            </CardDescription>

            {lastCheckedLabel && (
              <p className="mt-2 text-xs text-muted-foreground">
                Last checked {lastCheckedLabel}
              </p>
            )}
          </div>

          {/*
           * ------------------------------------------------
           * Actions
           * ------------------------------------------------
           */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={reputation.isFetching || !refreshAvailable}
              onClick={handleManualRefresh}
            >
              <RefreshCw
                className={cn(
                  "size-4",

                  reputation.isFetching && "animate-spin"
                )}
              />

              {reputation.isFetching
                ? "Refreshing..."
                : refreshAvailable
                ? "Refresh from Google"
                : `Refresh in ${formatCooldown(remainingCooldown)}`}
            </Button>

            {data.googleMapsUrl && (
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",

                    size: "sm",
                  }),

                  "gap-2"
                )}
              >
                View on Google
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/*
         * ------------------------------------------------
         * Main metrics
         * ------------------------------------------------
         */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-muted/20 p-5">
            <p className="text-sm text-muted-foreground">Google rating</p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-3xl font-semibold tracking-tight">
                {rating !== null ? rating.toFixed(1) : "—"}
              </p>

              {rating !== null && <RatingStars rating={rating} />}
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-5">
            <p className="text-sm text-muted-foreground">Google reviews</p>

            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {reviewCount.toLocaleString()}
            </p>
          </div>
        </div>

        {/*
         * ------------------------------------------------
         * Important UX notice
         * ------------------------------------------------
         */}
        <div className="rounded-xl border bg-muted/20 px-4 py-3">
          <p className="text-xs leading-5 text-muted-foreground">
            Recently submitted Google reviews may take some time to appear. Use
            Refresh from Google when you expect updated reputation data.
          </p>
        </div>

        <div>
          <div className="mb-4">
            <h3 className="font-semibold">Featured Google Reviews</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Up to 5 reviews selected by Google based on relevance.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6">
              <p className="text-sm text-muted-foreground">
                No Google review content is available for this location yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => {
                const initial = (review.author.name?.[0] ?? "G").toUpperCase();

                return (
                  <div key={review.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium">
                          {review.author.photoUrl ? (
                            <img
                              width={200}
                              height={200}
                              src={review.author.photoUrl}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            initial
                          )}
                        </div>

                        <div className="min-w-0">
                          {review.author.profileUrl ? (
                            <a
                              href={review.author.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate text-sm font-medium hover:underline"
                            >
                              {review.author.name}
                            </a>
                          ) : (
                            <p className="truncate text-sm font-medium">
                              {review.author.name}
                            </p>
                          )}

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <RatingStars rating={review.rating} />

                            {review.relativeTime && (
                              <span className="text-xs text-muted-foreground">
                                {review.relativeTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {review.rating <= 2 && (
                        <Badge variant="destructive">Needs attention</Badge>
                      )}
                    </div>

                    {review.text && (
                      <p
                        dir="auto"
                        className="mt-4 whitespace-pre-wrap text-sm leading-6"
                      >
                        {review.text}
                      </p>
                    )}

                    {review.googleMapsUrl && (
                      <div className="mt-4">
                        <a
                          href={review.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          View review on Google
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">Google Maps</p>
      </CardContent>
    </Card>
  );
}
