import {
  api,
} from "@/lib/api";
import { AnalyticsRange } from "@/types/analytics-filter";

import type {
  EngagementPatternsData,
  EngagementPatternsResponse,
} from "@/types/engagement-patterns";

type GetEngagementPatternsParams = {
  storeId:
  string;

  range: AnalyticsRange
};

export async function getEngagementPatterns({
  storeId,
  range,
}: GetEngagementPatternsParams): Promise<EngagementPatternsData> {
  const {
    data,
  } =
    await api.get<EngagementPatternsResponse>(
      `/analytics/stores/${storeId}/engagement-patterns`,
      {
        params: {
          preset:
          range.preset,
      
        from:
          range.from,
      
        to:
          range.to,
      
        timeZone:
          range.timeZone,
        },
      }
    );

  return data.data;
}