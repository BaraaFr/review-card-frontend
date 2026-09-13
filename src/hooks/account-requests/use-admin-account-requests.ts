import {
    keepPreviousData,
    useQuery,
  } from "@tanstack/react-query";
  
  import {
    getAdminAccountRequests,
    type AdminAccountRequestQuery,
  } from "@/services/admin-account-request.service";
  
  export const accountRequestKeys = {
    all: [
      "account-requests",
    ] as const,
  
    admin: (
      query:
        AdminAccountRequestQuery
    ) =>
      [
        ...accountRequestKeys.all,
        "admin",
        query,
      ] as const,
  };
  
  export function useAdminAccountRequests(
    query:
      AdminAccountRequestQuery
  ) {
    return useQuery({
      queryKey:
        accountRequestKeys.admin(
          query
        ),
  
      queryFn: () =>
        getAdminAccountRequests(
          query
        ),
  
      placeholderData:
        keepPreviousData,
  
      staleTime:
        30 *
        1000,
    });
  }