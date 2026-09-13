import {
  useQuery,
} from "@tanstack/react-query";

import {
  getGoogleReputation,
} from "@/services/google.service";

import {
  googleKeys,
} from "./google.keys";

export function useGoogleReputation(
  storeId?: string,
  enabled = true
) {
  return useQuery({
    queryKey:
      googleKeys.reputation(
        storeId ?? ""
      ),

    queryFn: () =>
      getGoogleReputation(
        storeId!
      ),

    enabled:
      Boolean(storeId) &&
      enabled,

    /*
     * Don't consider the data stale
     * for one hour during the current
     * application session.
     */
    staleTime:
      60 * 60 * 1000,

    /*
     * Very important for Google cost.
     *
     * Do not automatically request
     * reputation again just because
     * the user changes browser tabs.
     */
    refetchOnWindowFocus:
      false,

    /*
     * Don't call Google just because
     * network connectivity returns.
     */
    refetchOnReconnect:
      false,

    /*
     * No interval polling.
     */
    refetchInterval:
      false,

    retry:
      1,
  });
}