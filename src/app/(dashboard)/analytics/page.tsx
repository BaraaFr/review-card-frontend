"use client";

import { useMemo, useState } from "react";

import { CalendarDays, Download, Loader2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EngagementOverview } from "@/components/analytics/engagement-overview";

import { ActionCenter } from "@/components/analytics/action-center";

import { EngagementPatterns } from "@/components/analytics/engagement-patterns";

import { LocationPerformance } from "@/components/analytics/location-performance";

import { CardPerformance } from "@/components/analytics/card-performance";

import { WeeklyReportPreview } from "@/components/analytics/weekly-report-preview";

import { downloadAnalyticsReport } from "@/services/analytics-report.service";

import {
  formatLocalDate,
  resolveAnalyticsRange,
  validateCustomAnalyticsRange,
} from "@/lib/analytics-date-range";

import type {
  AnalyticsCustomRange,
  AnalyticsPreset,
} from "@/types/analytics-filter";
import { useBusinessStore } from "@/stores/business.store";
import { useBusinesses } from "@/hooks/business/use-businesses";
import { useSubscriptionUsage } from "@/hooks/subscriptions/use-subscription";
import { getEffectiveSubscriptionStatus } from "@/lib/subscription";
import { AnalyticsLockedState } from "@/components/analytics/analytics-locked-state";
import { useMe } from "@/hooks/auth/use-me";

/*
 * =========================================================
 * Analytics Page
 * =========================================================
 */

export default function AnalyticsPage() {
  /*
   * =======================================================
   * Business
   * =======================================================
   */

  const { data: user } = useMe();
  const { businessId } = useBusinessStore();

  const { data: businesses = [] } = useBusinesses();

  const selectedBusiness = businesses.find(
    (business) => business.id === businessId
  );

  const stores = selectedBusiness?.stores ?? [];

  const subscriptionQuery = useSubscriptionUsage(businessId);

  const subscription = subscriptionQuery.data?.subscription;

  const analyticsAllowed = Boolean(subscription?.usable);
  /*
   * =======================================================
   * Location filter
   * =======================================================
   */

  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  /*
   * If:
   *
   * - selectedStoreId exists
   * - and that location still exists
   *
   * use it.
   *
   * Otherwise use first location.
   *
   * No useEffect is needed.
   */

  const effectiveStoreId = useMemo(() => {
    if (
      selectedStoreId &&
      stores.some((store) => store.id === selectedStoreId)
    ) {
      return selectedStoreId;
    }

    return stores[0]?.id ?? null;
  }, [selectedStoreId, stores]);

  const selectedStore = useMemo(
    () => stores.find((store) => store.id === effectiveStoreId),
    [stores, effectiveStoreId]
  );

  const selectedStoreLabel = selectedStore?.name?.trim() || "Unnamed location";

  /*
   * =======================================================
   * Period filter
   * =======================================================
   */

  const [period, setPeriod] = useState<AnalyticsPreset>("30d");

  const [customRange, setCustomRange] = useState<AnalyticsCustomRange>({
    from: "",

    to: "",
  });

  /*
   * Convert the selected preset into
   * the actual analytics range.
   *
   * Example:
   *
   * {
   *   preset: "30d",
   *   from: "2026-08-14",
   *   to: "2026-09-12",
   *   timeZone: "Asia/Beirut"
   * }
   */

  const analyticsRange = useMemo(
    () => resolveAnalyticsRange(period, customRange),
    [period, customRange]
  );

  /*
   * =======================================================
   * Download report
   * =======================================================
   */

  const [downloading, setDownloading] = useState(false);

  /*
   * =======================================================
   * Period change
   * =======================================================
   */

  const handlePeriodChange = (nextPeriod: AnalyticsPreset) => {
    /*
     * When Custom is selected for the
     * first time, initialize it with
     * the current month.
     *
     * This avoids showing empty date
     * inputs immediately.
     */

    if (nextPeriod === "custom" && (!customRange.from || !customRange.to)) {
      const currentMonth = resolveAnalyticsRange("this-month", {
        from: "",

        to: "",
      });

      if (currentMonth) {
        setCustomRange({
          from: currentMonth.from,

          to: currentMonth.to,
        });
      }
    }

    setPeriod(nextPeriod);
  };
  const handleDownload = async () => {
    if (!effectiveStoreId || !analyticsRange) {
      return;
    }

    try {
      setDownloading(true);

      await downloadAnalyticsReport({
        storeId: effectiveStoreId,

        storeName: selectedStoreLabel,

        range: analyticsRange,
      });
    } catch (error) {
      console.error("Failed to download analytics report:", error);
    } finally {
      setDownloading(false);
    }
  };
  /*
   * =======================================================
   * Empty business
   * =======================================================
   */

  if (!selectedBusiness) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div
          className="
            max-w-md
            rounded-2xl
            border
            border-border/60
            bg-card
            p-8
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto mb-4
              flex size-12
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600

              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          >
            <MapPin className="size-5" />
          </div>

          <h2 className="text-lg font-semibold">No business selected</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Select a business before viewing analytics.
          </p>
        </div>
      </div>
    );
  }

  if (!subscriptionQuery.isLoading && !analyticsAllowed) {
    const effectiveStatus = subscription
      ? getEffectiveSubscriptionStatus(subscription)
      : null;

    return (
      <div className="space-y-7">
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Performance overview
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Welcome back, {user?.name.split(" ")[0]}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Your review cards remain active even while analytics access is
            locked.
          </p>
        </div>

        <AnalyticsLockedState
          reason={
            effectiveStatus === "PAST_DUE"
              ? "PAST_DUE"
              : effectiveStatus === "CANCELED"
              ? "CANCELED"
              : subscription
              ? "EXPIRED"
              : "NO_SUBSCRIPTION"
          }
        />
      </div>
    );
  }

  /*
   * =======================================================
   * No locations
   * =======================================================
   */

  if (stores.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div
          className="
            max-w-md
            rounded-2xl
            border
            border-border/60
            bg-card
            p-8
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto mb-4
              flex size-12
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600

              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          >
            <MapPin className="size-5" />
          </div>

          <h2 className="text-lg font-semibold">No locations yet</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add a location before viewing customer engagement analytics.
          </p>
        </div>
      </div>
    );
  }

  /*
   * =======================================================
   * Custom range validation
   * =======================================================
   */

  const customRangeError =
    period === "custom" ? validateCustomAnalyticsRange(customRange) : null;

  /*
   * =======================================================
   * Page
   * =======================================================
   */

  return (
    <div className="min-h-full w-full">
      <div
        className="
          mx-auto
          flex w-full
          max-w-[1600px]
          flex-col
          gap-6
          p-4
          sm:p-6
          lg:p-8
        "
      >
        {/* =================================================
            Page Header
        ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-border/60
            bg-card
            p-5
            shadow-sm

            sm:p-6
          "
        >
          {/* Decorative background */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              size-56
              rounded-full
              bg-emerald-500/5
              blur-3xl

              dark:bg-emerald-400/5
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              right-32
              size-48
              rounded-full
              bg-emerald-500/5
              blur-3xl

              dark:bg-emerald-400/5
            "
          />

          <div className="relative space-y-5">
            {/* Header title */}

            <div>
              <div className="flex items-center gap-2">
                <div
                  className="
                    h-5 w-1
                    rounded-full
                    bg-emerald-500
                  "
                />

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-emerald-600

                    dark:text-emerald-400
                  "
                >
                  ValYou Analytics
                </p>
              </div>

              <div className="mt-2">
                <h1
                  className="
                    text-2xl
                    font-semibold
                    tracking-tight

                    sm:text-3xl
                  "
                >
                  Customer engagement
                </h1>

                <p
                  className="
                    mt-1
                    max-w-2xl
                    text-sm
                    text-muted-foreground
                  "
                >
                  Understand how customers interact with your locations, cards,
                  and Google reputation.
                </p>
              </div>
            </div>

            {/* =============================================
                Filters
            ============================================= */}

            <div className="space-y-2">
              <div
                className="
                  flex flex-col
                  gap-4
                  rounded-xl
                  border
                  border-border/60
                  bg-muted/20
                  p-4

                  lg:flex-row
                  lg:items-end
                "
              >
                {/* =========================================
                    Location
                ========================================= */}

                <div
                  className="
                    min-w-0
                    flex-1
                    space-y-1.5

                    lg:max-w-[260px]
                  "
                >
                  <label className="text-xs font-medium text-muted-foreground">
                    Location
                  </label>

                  <Select
                    value={effectiveStoreId}
                    onValueChange={(value, _eventDetails) => {
                      if (value !== null) {
                        setSelectedStoreId(value);
                      }
                    }}
                  >
                    <SelectTrigger
                      className="
                        h-10
                        w-full
                        bg-background
                        shadow-sm
                      "
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin
                          className="
                            size-4
                            shrink-0
                            text-emerald-600

                            dark:text-emerald-400
                          "
                        />

                        <span className="truncate">{selectedStoreLabel}</span>
                      </div>
                    </SelectTrigger>

                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name?.trim() || "Unnamed location"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* =========================================
                    Period
                ========================================= */}

                <div
                  className="
                    w-full
                    space-y-1.5

                    lg:w-[180px]
                  "
                >
                  <label className="text-xs font-medium text-muted-foreground">
                    Period
                  </label>

                  <Select
                    value={period}
                    onValueChange={(value, _eventDetails) => {
                      if (value !== null) {
                        handlePeriodChange(value as AnalyticsPreset);
                      }
                    }}
                  >
                    <SelectTrigger
                      className="
                        h-10
                        w-full
                        bg-background
                        shadow-sm
                      "
                    >
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          className="
                            size-4
                            shrink-0
                            text-emerald-600

                            dark:text-emerald-400
                          "
                        />

                        <SelectValue />
                      </div>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>

                      <SelectItem value="30d">Last 30 days</SelectItem>

                      <SelectItem value="this-month">This month</SelectItem>

                      <SelectItem value="last-month">Last month</SelectItem>

                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* =========================================
                    Custom range
                ========================================= */}

                {period === "custom" && (
                  <div
                    className="
                      grid
                      w-full
                      grid-cols-1
                      gap-3

                      sm:grid-cols-2
                      lg:w-[340px]
                    "
                  >
                    {/* From */}

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        From
                      </label>

                      <input
                        type="date"
                        value={customRange.from}
                        max={customRange.to || formatLocalDate(new Date())}
                        onChange={(event) => {
                          setCustomRange((current) => ({
                            ...current,

                            from: event.target.value,
                          }));
                        }}
                        className=" flex h-10
                          w-full
                          rounded-md
                          border
                          border-input
                          bg-background
                          px-3
                          py-2
                          text-sm
                          shadow-sm
                          outline-none
                          transition-colors

                          focus:border-emerald-500
                          focus:ring-2
                          focus:ring-emerald-500/20

                          disabled:cursor-not-allowed
                          disabled:opacity-50

                          dark:[color-scheme:dark]
                        "
                      />
                    </div>

                    {/* To */}

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        To
                      </label>

                      <input
                        type="date"
                        value={customRange.to}
                        min={customRange.from || undefined}
                        max={formatLocalDate(new Date())}
                        onChange={(event) => {
                          setCustomRange((current) => ({
                            ...current,

                            to: event.target.value,
                          }));
                        }}
                        className="
                          flex
                          h-10
                          w-full
                          rounded-md
                          border
                          border-input
                          bg-background
                          px-3
                          py-2
                          text-sm
                          shadow-sm
                          outline-none
                          transition-colors

                          focus:border-emerald-500
                          focus:ring-2
                          focus:ring-emerald-500/20

                          disabled:cursor-not-allowed
                          disabled:opacity-50

                          dark:[color-scheme:dark]
                        "
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Custom validation */}

              {customRangeError && (
                <p
                  className="
                    px-1
                    text-xs
                    font-medium
                    text-amber-600

                    dark:text-amber-400
                  "
                >
                  {customRangeError}
                </p>
              )}

              {/* Current period hint */}

              {analyticsRange && (
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    px-1
                    text-xs
                    text-muted-foreground
                  "
                >
                  <span>Showing</span>

                  <span className="font-medium text-foreground">
                    {analyticsRange.from}
                  </span>

                  <span>to</span>

                  <span className="font-medium text-foreground">
                    {analyticsRange.to}
                  </span>

                  <span className="hidden sm:inline">•</span>

                  <span>{analyticsRange.timeZone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            Analytics Content
        ================================================= */}

        {effectiveStoreId && analyticsRange ? (
          <div className="space-y-6">
            {/* =============================================
                1. Engagement Overview
            ============================================= */}

            <EngagementOverview
              storeId={effectiveStoreId}
              range={analyticsRange}
            />

            {/* =============================================
                2. Action Center
            ============================================= */}

            <ActionCenter storeId={effectiveStoreId} range={analyticsRange} />

            {/* =============================================
                3. Google Reputation
            ============================================= */}

            {/* <GoogleReputation
              storeId={
                effectiveStoreId
              }
            /> */}

            {/* =============================================
                4. Engagement Patterns
            ============================================= */}

            <EngagementPatterns
              storeId={effectiveStoreId}
              range={analyticsRange}
            />

            {/* =============================================
                5. Location Performance
            ============================================= */}

            <LocationPerformance
              storeId={effectiveStoreId}
              range={analyticsRange}
            />

            {/* =============================================
                6. Card Performance
            ============================================= */}

            <CardPerformance
              storeId={effectiveStoreId}
              range={analyticsRange}
            />

            {/* =============================================
                7. Weekly Report Preview
            =============================================

                Keep this WEEKLY.

                The dashboard custom date range must NOT
                alter the automatic weekly report preview.
            ============================================= */}

            <WeeklyReportPreview
              storeId={effectiveStoreId}
              downloading={downloading}
              onDownload={handleDownload}
            />
          </div>
        ) : (
          /*
           * Invalid custom range
           */

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-border
              bg-muted/20
              px-6
              py-14
              text-center
            "
          >
            <CalendarDays
              className="
                mx-auto
                size-8
                text-muted-foreground/60
              "
            />

            <h3 className="mt-4 text-sm font-semibold">
              Select a valid date range
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose a start and end date to load analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
