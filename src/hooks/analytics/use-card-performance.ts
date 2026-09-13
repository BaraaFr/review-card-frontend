import {
  useQuery,
} from "@tanstack/react-query";

import {
  getCardPerformance,
} from "@/services/card-performance.service";
import { AnalyticsRange } from "@/types/analytics-filter";


type UseCardPerformanceParams = {
  storeId:string | null | undefined;
  range: AnalyticsRange
};

export function useCardPerformance({
  storeId,
  range
}: UseCardPerformanceParams) {
  return useQuery({
    queryKey:
      [
        "analytics",
        "card-performance",
        storeId ?? "",
        range.preset,
        range.from,
        range.to,
        range.timeZone,
      ],

    queryFn: () =>
      getCardPerformance({
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