import {
    api,
  } from "@/lib/api";
  
  import type {
    AdminOverview,
  } from "@/types/overview";
  
  type Response = {
    success: boolean;
  
    data: {
      overview:
        AdminOverview;
    };
  };
  
  export const adminOverviewService = {
    async get() {
      const response =
        await api.get<Response>(
          "/admin/overview"
        );
  
      return response.data.data
        .overview;
    },
  };