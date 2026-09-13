"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  analyticsService,
} from "@/services/analytics.service";

import type {
  AnalyticsFilters,
} from "@/types/analytics";

export const analyticsKeys = {
  all: [
    "analytics",
  ] as const,

  overview: (
    filters: AnalyticsFilters
  ) =>
    [
      ...analyticsKeys.all,
      "overview",
      filters,
    ] as const,

  timeline: (
    filters: AnalyticsFilters
  ) =>
    [
      ...analyticsKeys.all,
      "timeline",
      filters,
    ] as const,

  cards: (
    filters: AnalyticsFilters
  ) =>
    [
      ...analyticsKeys.all,
      "cards",
      filters,
    ] as const,

  stores: (
    filters: AnalyticsFilters
  ) =>
    [
      ...analyticsKeys.all,
      "stores",
      filters,
    ] as const,
};

export function useAnalyticsOverview(
  filters: AnalyticsFilters,
  enabled = true
) {
  return useQuery({
    queryKey:
      analyticsKeys.overview(
        filters
      ),

    queryFn: () =>
      analyticsService
        .getOverview(
          filters
        ),

    enabled:
      enabled &&
      Boolean(
        filters.businessId
      ),
  });
}

export function useAnalyticsTimeline(
  filters: AnalyticsFilters,
  enabled = true
) {
  return useQuery({
    queryKey:
      analyticsKeys.timeline(
        filters
      ),

    queryFn: () =>
      analyticsService
        .getTimeline(
          filters
        ),

    enabled:
      enabled &&
      Boolean(
        filters.businessId
      ),
  });
}

export function useCardAnalytics(
  filters: AnalyticsFilters,
  enabled = true
) {
  return useQuery({
    queryKey:
      analyticsKeys.cards(
        filters
      ),

    queryFn: () =>
      analyticsService
        .getCards(
          filters
        ),

    enabled:
      enabled &&
      Boolean(
        filters.businessId
      ),
  });
}

export function useStoreAnalytics(
  filters: AnalyticsFilters,
  enabled = true
) {
  return useQuery({
    queryKey:
      analyticsKeys.stores(
        filters
      ),

    queryFn: () =>
      analyticsService
        .getStores(
          filters
        ),

    enabled:
      enabled &&
      Boolean(
        filters.businessId
      ),
  });
}