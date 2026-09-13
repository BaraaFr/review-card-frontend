import {
    useMutation,
    useQuery,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getWeeklyReportSettings,
    sendTestWeeklyReport,
    updateWeeklyReportSettings,
  } from "@/services/weekly-report-settings.service";
  
  import type {
    WeeklyReportDay,
  } from "@/types/weekly-report-settings";
  
  export const weeklyReportSettingsKeys = {
    all: [
      "weekly-report-settings",
    ] as const,
  
    business: (
      businessId:
        string
    ) =>
      [
        ...weeklyReportSettingsKeys.all,
        businessId,
      ] as const,
  };
  
  export function useWeeklyReportSettings(
    businessId:
      string | null | undefined
  ) {
    return useQuery({
      queryKey:
        weeklyReportSettingsKeys.business(
          businessId ?? ""
        ),
  
      queryFn: () =>
        getWeeklyReportSettings(
          businessId!
        ),
  
      enabled:
        Boolean(
          businessId
        ),
  
      staleTime:
        60 *
        1000,
    });
  }
  
  export function useUpdateWeeklyReportSettings(
    businessId:
      string
  ) {
    const queryClient =
      useQueryClient();
  
    return useMutation({
      mutationFn: (
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
      ) =>
        updateWeeklyReportSettings(
          businessId,
          input
        ),
  
      onSuccess: (
        data
      ) => {
        queryClient.setQueryData(
          weeklyReportSettingsKeys.business(
            businessId
          ),
          data
        );
      },
    });
  }
  
  export function useSendTestWeeklyReport(
    businessId:
      string
  ) {
    return useMutation({
      mutationFn: () =>
        sendTestWeeklyReport(
          businessId
        ),
    });
  }