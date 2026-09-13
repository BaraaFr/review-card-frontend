import {
    api,
  } from "@/lib/api";
  
  import type {
    WeeklyReportData,
    WeeklyReportResponse,
  } from "@/types/weekly-report";
  
  type GetWeeklyReportParams = {
    storeId:
      string;
  
    timeZone:
      string;
  };
  
  export async function getWeeklyReport({
    storeId,
    timeZone,
  }: GetWeeklyReportParams): Promise<WeeklyReportData> {
    const {
      data,
    } =
      await api.get<WeeklyReportResponse>(
        `/analytics/stores/${storeId}/weekly-report`,
        {
          params: {
            timeZone,
          },
        }
      );
  
    return data.data;
  }