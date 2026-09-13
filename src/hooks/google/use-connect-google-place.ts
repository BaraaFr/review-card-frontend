import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  connectGooglePlace,
} from "@/services/google.service";

import {
  googleKeys,
} from "./google.keys";

export function useConnectGooglePlace() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      storeId: string
    ) =>
      connectGooglePlace(
        storeId
      ),

    onSuccess: (
      result,
      storeId
    ) => {
      /*
       * Only invalidate caches if
       * Google was actually connected.
       */
      if (
        result.status !==
        "CONNECTED"
      ) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: [
          "stores",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "businesses",
        ],
      });

      queryClient.invalidateQueries({
        queryKey:
          googleKeys.reputation(
            storeId
          ),
      });
    },
  });
}