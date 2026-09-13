import {
    api,
  } from "@/lib/api";
  
  import type {
    AccountRequest,
    AccountRequestStatus,
    AdminAccountRequestList,
  } from "@/types/account-request";
  
  export type AdminAccountRequestQuery = {
    page?: number;
  
    perPage?: number;
  
    search?: string;
  
    status?:
      AccountRequestStatus;
  };
  
  export async function getAdminAccountRequests(
    query:
      AdminAccountRequestQuery
  ): Promise<AdminAccountRequestList> {
    const {
      data,
    } =
      await api.get(
        "/admin/account-requests",
        {
          params:
            query,
        }
      );
  
    return data.data;
  }
  
  export async function updateAdminAccountRequest(
    requestId: string,
    input: {
      status?:
        AccountRequestStatus;
  
      adminNote?:
        | string
        | null;
    }
  ): Promise<AccountRequest> {
    const {
      data,
    } =
      await api.patch(
        `/admin/account-requests/${requestId}`,
        input
      );
  
    return data.data;
  }