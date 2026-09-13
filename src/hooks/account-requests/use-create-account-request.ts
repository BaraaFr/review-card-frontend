import {
    useMutation,
  } from "@tanstack/react-query";
  
  import {
    createPublicAccountRequest,
  } from "@/services/public-account-request.service";
  
  export function useCreateAccountRequest() {
    return useMutation({
      mutationFn:
        createPublicAccountRequest,
    });
  }