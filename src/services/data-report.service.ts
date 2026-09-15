import {
    api,
  } from "@/lib/api";
  
  import type {
    AnalyticsRange,
  } from "@/types/analytics-filter";
  
  import type {
    DataReportData,
    DataReportResponse,
  } from "@/types/data-report";
  
  type GetDataReportParams = {
    storeId:
      string;
  
    range:
      AnalyticsRange;
  };
  
  export async function getDataReport({
    storeId,
    range,
  }: GetDataReportParams): Promise<DataReportData> {
    const {
      data,
    } =
      await api.get<DataReportResponse>(
        `/analytics/stores/${storeId}/data-report`,
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