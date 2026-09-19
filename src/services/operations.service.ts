import {
    api,
  } from "@/lib/api";
  
  import type {
    OperationalHealth,
  } from "@/types/operations";
  
  type Response = {
    success:
      boolean;
  
    data: {
      health:
        OperationalHealth;
    };
  };
  
  export const operationsService = {
    async getHealth() {
      const response =
        await api.get<Response>(
          "/admin/operations/health"
        );
  
      return response
        .data
        .data
        .health;
    },
  };