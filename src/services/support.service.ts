import {
    api,
  } from "@/lib/api";
  
  export type TawkIdentity = {
    userId: string;
    name: string;
    email: string;
    hash: string;
  };
  
  export const supportService = {
    async getTawkIdentity() {
      const response =
        await api.get<{
          success: true;
          data: TawkIdentity;
        }>(
          "/support/tawk-identity"
        );
  
      return response.data.data;
    },
  };