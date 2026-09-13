import {
  api,
} from "@/lib/api";

import type {
  ActionCenterData,
  ActionCenterResponse,
} from "@/types/action-center";
import { AnalyticsRange } from "@/types/analytics-filter";

type GetActionCenterParams = {
  storeId:
  string;

  range: AnalyticsRange
};

export async function getActionCenter({
  storeId,
  range,
}: GetActionCenterParams): Promise<ActionCenterData> {
  const {
    data,
  } =
    await api.get<ActionCenterResponse>(
      `/analytics/stores/${storeId}/action-center`,
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