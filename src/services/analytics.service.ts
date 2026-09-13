import {
    api,
  } from "@/lib/api";
  
  import type {
    AnalyticsFilters,
    AnalyticsOverview,
    CardAnalytics,
    StoreAnalytics,
    TimelinePoint,
  } from "@/types/analytics";
  
  export const analyticsService = {
    async getOverview(
      filters: AnalyticsFilters
    ) {
      const response =
        await api.get<{
          success: boolean;
  
          data: {
            overview:
              AnalyticsOverview;
          };
        }>(
          "/analytics/overview",
          {
            params: filters,
          }
        );
  
      return response.data.data
        .overview;
    },
  
    async getTimeline(
      filters: AnalyticsFilters
    ) {
      const response =
        await api.get<{
          success: boolean;
  
          data: {
            period: {
              from: string;
              to: string;
            };
  
            timeline:
              TimelinePoint[];
          };
        }>(
          "/analytics/timeline",
          {
            params: filters,
          }
        );
  
      return response.data.data;
    },
  
    async getCards(
      filters: AnalyticsFilters
    ) {
      const response =
        await api.get<{
          success: boolean;
  
          data: {
            period: {
              from: string;
              to: string;
            };
  
            cards:
              CardAnalytics[];
          };
        }>(
          "/analytics/cards",
          {
            params: filters,
          }
        );
  
      return response.data.data;
    },
  
    async getStores(
      filters: AnalyticsFilters
    ) {
      const response =
        await api.get<{
          success: boolean;
  
          data: {
            period: {
              from: string;
              to: string;
            };
  
            stores:
              StoreAnalytics[];
          };
        }>(
          "/analytics/stores",
          {
            params: filters,
          }
        );
  
      return response.data.data;
    },
  };