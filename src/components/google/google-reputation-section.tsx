"use client";

import { Building2, MapPin } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";

import { GoogleReputationCard } from "@/components/google/google-reputation-card";

import { LocationGoogleConnection } from "@/components/google/location-google-connection";

import type { Store } from "@/types/business";
import { EngagementOverview } from "../analytics/engagement-overview";

type Props = {
  businessId: string;

  stores: Store[];

  isLoading?: boolean;

  hasAnalyticsAccess: boolean;
};

function isGoogleConnected(store: Store) {
  return Boolean(
    store.googlePlaceId &&
      store.googleReviewUrl &&
      store.googlePlaceConnectedFromUrl === store.googleReviewUrl
  );
}

function getStorageKey(businessId: string) {
  return `valyou:google-reputation:selected-store:${businessId}`;
}

export function GoogleReputationSection({
  businessId,
  stores,
  isLoading = false,
  hasAnalyticsAccess,
}: Props) {
  const [selectedStoreId, setSelectedStoreId] = useState("");

  /*
   * Used to notice when locations
   * are added/removed or their
   * Google connection changes.
   */
  const storeSignature = useMemo(
    () =>
      stores
        .map((store) =>
          [
            store.id,
            store.googlePlaceId ?? "",
            store.googleReviewUrl ?? "",
            store.googlePlaceConnectedFromUrl ?? "",
          ].join(":")
        )
        .join("|"),

    [stores]
  );

  /*
   * Choose default location.
   *
   * Priority:
   *
   * 1. currently selected location
   * 2. previously selected location
   * 3. first Google-connected location
   * 4. first location
   */
  useEffect(() => {
    if (!businessId || stores.length === 0) {
      setSelectedStoreId("");

      return;
    }

    setSelectedStoreId((current) => {
      /*
       * Keep current selection if
       * it still exists.
       */
      if (current && stores.some((store) => store.id === current)) {
        return current;
      }

      const storageKey = getStorageKey(businessId);

      const persisted = window.localStorage.getItem(storageKey);

      /*
       * Restore the owner's previous
       * selection for this business.
       */
      if (persisted && stores.some((store) => store.id === persisted)) {
        return persisted;
      }

      /*
       * Otherwise prefer a location
       * where Google is connected.
       */
      const firstConnected = stores.find(isGoogleConnected);

      const nextStoreId = firstConnected?.id ?? stores[0].id;

      window.localStorage.setItem(storageKey, nextStoreId);

      return nextStoreId;
    });
  }, [businessId, storeSignature, stores]);

  const selectedStore = useMemo(
    () => stores.find((store) => store.id === selectedStoreId) ?? null,

    [stores, selectedStoreId]
  );

  const connectedCount = useMemo(
    () => stores.filter(isGoogleConnected).length,

    [stores]
  );

  function handleLocationChange(storeId: string) {
    setSelectedStoreId(storeId);

    window.localStorage.setItem(getStorageKey(businessId), storeId);
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-sm text-muted-foreground">
            Loading Google reputation...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (stores.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
              <Building2 className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-4 font-medium">No locations yet</p>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Add a location to start using Google Reputation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Google Reputation
            </h2>

            <Badge variant="secondary">
              {connectedCount} / {stores.length} connected
            </Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            View Google reputation for each business location.
          </p>
        </div>

        {stores.length > 1 && (
          <div className="w-full lg:w-72">
            <label
              htmlFor="google-reputation-location"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Location
            </label>

            {/*
             * Native select is used
             * intentionally.
             *
             * It is accessible,
             * responsive and doesn't
             * depend on Radix/Base UI
             * render APIs.
             */}
            <select
              id="google-reputation-location"
              value={selectedStoreId}
              onChange={(event) => handleLocationChange(event.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                  {isGoogleConnected(store) ? " · Connected" : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {selectedStore && (
        <>
          <div className="flex flex-col justify-between gap-3 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
                <MapPin className="size-4 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <p className="font-medium">{selectedStore.name}</p>

                {selectedStore.address ? (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {selectedStore.address}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    No address added
                  </p>
                )}
              </div>
            </div>

            {isGoogleConnected(selectedStore) ? (
              <Badge variant="secondary">Google connected</Badge>
            ) : (
              <Badge variant="outline">Google not connected</Badge>
            )}
          </div>

          {/*
           * NOT CONNECTED:
           *
           * Show the Google
           * connection workflow.
           *
           * No reputation query
           * is mounted.
           */}
          {!isGoogleConnected(selectedStore) && (
            <LocationGoogleConnection store={selectedStore} />
          )}

          {/*
           * CONNECTED:
           *
           * Mount exactly ONE
           * reputation card.
           *
           * Therefore only the
           * selected location can
           * request Google data.
           */}
          {isGoogleConnected(selectedStore) && (
            <GoogleReputationCard
              store={selectedStore}
              hasAnalyticsAccess={hasAnalyticsAccess}
            />
          )}
        </>
      )}

    </section>
  );
}
