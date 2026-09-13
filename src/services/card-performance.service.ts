import {
  api,
} from "@/lib/api";
import { AnalyticsRange } from "@/types/analytics-filter";

import type {
  CardPerformanceData,
  CardPerformanceResponse,
} from "@/types/card-performance";

type GetCardPerformanceParams = {
  storeId:
  string;
  range: AnalyticsRange
};

export async function getCardPerformance({
  storeId,
  range,
}: GetCardPerformanceParams): Promise<CardPerformanceData> {
  const {
    data,
  } =
    await api.get<CardPerformanceResponse>(
      `/analytics/stores/${storeId}/card-performance`,
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
    console.log(data)

  return data.data;
}