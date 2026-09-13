import {
  useQuery,
} from "@tanstack/react-query";

import {
  getEngagementAnalytics,
} from "@/services/engagement-analytics.service";
import { AnalyticsRange } from "@/types/analytics-filter";

type UseEngagementAnalyticsParams = {
  storeId:string | null | undefined;
  range: AnalyticsRange;
};

export function useEngagementAnalytics({
  storeId,
  range,
}: UseEngagementAnalyticsParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "engagement",
      storeId,
      range.preset,
      range.from,
      range.to,
      range.timeZone,
    ],

    queryFn: () =>
      getEngagementAnalytics({
        storeId: storeId!,
        range,
      }),

    enabled:
      Boolean(
        storeId
      ),

    /*
     * Analytics does not need to
     * hit the backend repeatedly
     * when navigating around.
     */

    staleTime:
      60 *
      1000,

    refetchOnWindowFocus:
      false,
  });
}