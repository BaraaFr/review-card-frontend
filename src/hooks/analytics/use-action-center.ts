import {
    useQuery,
  } from "@tanstack/react-query";
  
  import {
    getActionCenter,
  } from "@/services/action-center.service";
import { AnalyticsRange } from "@/types/analytics-filter";
  

  type UseActionCenterParams = {
    storeId:
      string | null | undefined;
  
    range:AnalyticsRange
  };
  
  export function useActionCenter({
    storeId,
    range
  }: UseActionCenterParams) {
    return useQuery({
      queryKey: [
        "analytics",
        storeId,
        range.preset,
        range.from,
        range.to,
        range.timeZone,
      ],
  
  
      queryFn: () =>
        getActionCenter({
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