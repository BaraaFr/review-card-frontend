import {
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    updateAdminAccountRequest,
  } from "@/services/admin-account-request.service";
  
  import {
    accountRequestKeys,
  } from "./use-admin-account-requests";
  
  import type {
    AccountRequestStatus,
  } from "@/types/account-request";
  
  export function useUpdateAccountRequest() {
    const queryClient =
      useQueryClient();
  
    return useMutation({
      mutationFn: ({
        requestId,
        status,
        adminNote,
      }: {
        requestId:
          string;
  
        status?:
          AccountRequestStatus;
  
        adminNote?:
          | string
          | null;
      }) =>
        updateAdminAccountRequest(
          requestId,
          {
            status,
            adminNote,
          }
        ),
  
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            accountRequestKeys.all,
        });
      },
    });
  }