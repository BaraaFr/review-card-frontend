import {
  api,
} from "@/lib/api";
import { AnalyticsRange } from "@/types/analytics-filter";

import type {
  LocationPerformanceData,
  LocationPerformanceResponse,
} from "@/types/location-performance";

type GetLocationPerformanceParams = {
  storeId:
  string;
  range: AnalyticsRange
};

export async function getLocationPerformance({
  storeId,
  range
}: GetLocationPerformanceParams): Promise<LocationPerformanceData> {
  const {
    data,
  } =
    await api.get<LocationPerformanceResponse>(
      `/analytics/stores/${storeId}/location-performance`,
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