import {
    api,
  } from "@/lib/api";
  
  import type {
    Store,
  } from "@/types/business";
  
  type StoresResponse = {
    success: boolean;
  
    data: {
      stores: Store[];
    };
  };
  
  type StoreResponse = {
    success: boolean;
  
    data: {
      store: Store;
    };
  };
  
  export type CreateStorePayload = {
    name: string;
  
    address?:
      | string
      | null;
  
    googleReviewUrl?:
      | string
      | null;
  };
  
  export type UpdateStorePayload =
    Partial<CreateStorePayload>;
  
  export const storesService = {
    async getByBusiness(
      businessId: string
    ) {
      const response =
        await api.get<StoresResponse>(
          `/businesses/${businessId}/stores`
        );
  
      return response.data.data
        .stores;
    },
  
    async create(
      businessId: string,
      payload: CreateStorePayload
    ) {
      const response =
        await api.post<StoreResponse>(
          `/businesses/${businessId}/stores`,
          payload
        );
  
      return response.data.data
        .store;
    },
  
    async update(
      storeId: string,
      payload: UpdateStorePayload
    ) {
      const response =
        await api.patch<StoreResponse>(
          `/stores/${storeId}`,
          payload
        );
  
      return response.data.data
        .store;
    },
  
    async remove(
      storeId: string
    ) {
      await api.delete(
        `/stores/${storeId}`
      );
    },
  };