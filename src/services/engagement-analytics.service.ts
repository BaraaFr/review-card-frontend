import {
  api,
} from "@/lib/api";
import { AnalyticsRange } from "@/types/analytics-filter";

import type {
  EngagementAnalytics,
  EngagementAnalyticsResponse,
} from "@/types/engagement-analytics";

export type GetEngagementAnalyticsParams = {
  storeId:
  string;

  range: AnalyticsRange
};

export async function getEngagementAnalytics({
  storeId,
  range,
}: GetEngagementAnalyticsParams): Promise<EngagementAnalytics> {
  const {
    data,
  } =
    await api.get<EngagementAnalyticsResponse>(
      `/analytics/stores/${storeId}/engagement-summary`,
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