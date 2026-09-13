import {
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    confirmGooglePlace,
  } from "@/services/google.service";
  
  import {
    googleKeys,
  } from "./google.keys";
  
  type Input = {
    storeId: string;
  
    placeId: string;
  
    confirmationToken:
      string;
  };
  
  export function useConfirmGooglePlace() {
    const queryClient =
      useQueryClient();
  
    return useMutation({
      mutationFn: ({
        storeId,
        placeId,
        confirmationToken,
      }: Input) =>
        confirmGooglePlace(
          storeId,
          {
            placeId,
            confirmationToken,
          }
        ),
  
      onSuccess: (
        _result,
        variables
      ) => {
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
              variables.storeId
            ),
        });
      },
    });
  }