import {
    api,
  } from "@/lib/api";
  
  import type {
    WeeklyReportDay,
    WeeklyReportSettings,
    WeeklyReportSettingsResponse,
  } from "@/types/weekly-report-settings";
  
  export async function getWeeklyReportSettings(
    businessId:
      string
  ): Promise<WeeklyReportSettings> {
    const {
      data,
    } =
      await api.get<WeeklyReportSettingsResponse>(
        `/weekly-reports/${businessId}/settings`
      );
  
    return data.data;
  }
  
  export async function updateWeeklyReportSettings(
    businessId:
      string,
    input: {
      enabled:
        boolean;
  
      day:
        WeeklyReportDay;
  
      time:
        string;
  
      timeZone:
        string;
  
      email:
        string | null;
    }
  ): Promise<WeeklyReportSettings> {
    const {
      data,
    } =
      await api.patch<WeeklyReportSettingsResponse>(
        `/weekly-reports/${businessId}/settings`,
        input
      );
  
    return data.data;
  }
  
  export async function sendTestWeeklyReport(
    businessId:
      string
  ) {
    const {
      data,
    } =
      await api.post(
        `/weekly-reports/${businessId}/settings/test`
      );
  
    return data;
  }