import {
  useQuery,
} from "@tanstack/react-query";

import {
  getLocationPerformance,
} from "@/services/location-performance.service";
import { AnalyticsRange } from "@/types/analytics-filter";

type UseLocationPerformanceParams = {
  storeId:
  string | null | undefined;

  range: AnalyticsRange
};

export function useLocationPerformance({
  storeId,
  range,
}: UseLocationPerformanceParams) {
  return useQuery({
    queryKey: [
      "analytics",
      "location-performance",
      storeId ?? "",
      range.preset,
      range.from,
      range.to,
      range.timeZone,
    ],

    queryFn: () =>
      getLocationPerformance({
        storeId:
          storeId!,

        range,
      }),

    enabled:
      Boolean(
        storeId
      ),

    staleTime:
      60 *
      1000,

    refetchOnWindowFocus:
      false,
  });
}