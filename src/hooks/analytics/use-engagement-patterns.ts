import {
  useQuery,
} from "@tanstack/react-query";

import {
  getEngagementPatterns,
} from "@/services/engagement-patterns.service";
import { AnalyticsRange } from "@/types/analytics-filter";

type UseEngagementPatternsParams = {
  storeId:
  string | null | undefined;

  range: AnalyticsRange

};

export function useEngagementPatterns({
  storeId,
  range,
}: UseEngagementPatternsParams) {
  return useQuery({
    queryKey: [
      storeId ?? "",
      range.preset,
      range.from,
      range.to,
      range.timeZone,
    ],

    queryFn: () =>
      getEngagementPatterns({
        storeId:
          storeId!,

        range,
      }),

    enabled:
      Boolean(
        storeId && range.timeZone
      ),

    staleTime:
      60 *
      1000,

    refetchOnWindowFocus:
      false,
  });
}