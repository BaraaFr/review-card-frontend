import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    disconnectGooglePlace,
} from "@/services/google.service";

import {
    googleKeys,
} from "./google.keys";

export function useDisconnectGooglePlace() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            storeId: string
        ) =>
            disconnectGooglePlace(
                storeId
            ),

        onSuccess: (
            _result,
            storeId
        ) => {
            /*
             * Store Google fields changed.
             */
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

            /*
             * Remove existing reputation
             * data from the query cache.
             */
            queryClient.removeQueries({
                queryKey:
                    googleKeys.reputation(
                        storeId
                    ),
            });
        },
    });
}