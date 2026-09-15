import {
    useQuery,
  } from "@tanstack/react-query";
  
  import {
    getDataReport,
  } from "@/services/data-report.service";
  
  import type {
    AnalyticsRange,
  } from "@/types/analytics-filter";
  
  export const dataReportKeys = {
    all:
      [
        "analytics",
        "data-report",
      ] as const,
  
    store: (
      storeId:
        string,
  
      range:
        AnalyticsRange
    ) =>
      [
        ...dataReportKeys.all,
  
        storeId,
  
        range.preset,
  
        range.from,
  
        range.to,
  
        range.timeZone,
      ] as const,
  };
  
  type UseDataReportParams = {
    storeId:
      string |
      null |
      undefined;
  
    range:
      AnalyticsRange;
  };
  
  export function useDataReport({
    storeId,
    range,
  }: UseDataReportParams) {
    return useQuery({
      queryKey:
        dataReportKeys.store(
          storeId ??
            "",
  
          range
        ),
  
      queryFn:
        () =>
          getDataReport({
            storeId:
              storeId!,
  
            range,
          }),
  
      enabled:
        Boolean(
          storeId
        ),
  
      staleTime:
        60 *
        1000,
  
      refetchOnWindowFocus:
        false,
    });
  }