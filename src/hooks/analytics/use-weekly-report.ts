import {
    useQuery,
  } from "@tanstack/react-query";
  
  import {
    getWeeklyReport,
  } from "@/services/weekly-report.service";
  
  export const weeklyReportKeys = {
    all: [
      "weekly-report",
    ] as const,
  
    store: (
      storeId: string,
      timeZone: string
    ) =>
      [
        ...weeklyReportKeys.all,
        storeId,
        timeZone,
      ] as const,
  };
  
  type UseWeeklyReportParams = {
    storeId:
      string | null | undefined;
  
    timeZone:
      string | null;
  };
  
  export function useWeeklyReport({
    storeId,
    timeZone,
  }: UseWeeklyReportParams) {
    return useQuery({
      queryKey:
        weeklyReportKeys.store(
          storeId ?? "",
          timeZone ?? ""
        ),
  
      queryFn: () =>
        getWeeklyReport({
          storeId:
            storeId!,
  
          timeZone:
            timeZone!,
        }),
  
      enabled:
        Boolean(
          storeId &&
          timeZone
        ),
  
      staleTime:
        60 *
        1000,
  
      refetchOnWindowFocus:
        false,
    });
  }