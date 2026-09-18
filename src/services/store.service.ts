import {
  idempotentRequest,
} from "@/lib/idempotent-request";

import {
  api,
} from "@/lib/api";

import type {
  Store,
} from "@/types/business";

type StoresResponse = {
  success:
    boolean;

  data: {
    stores:
      Store[];
  };
};

type StoreResponse = {
  success:
    boolean;

  data: {
    store:
      Store;
  };
};

export type CreateStorePayload = {
  name:
    string;

  address?:
    | string
    | null;

  googleReviewUrl?:
    | string
    | null;
};

export type UpdateStorePayload =
  Partial<
    CreateStorePayload
  >;

export const storesService = {
  /*
   * READ
   */
  async getByBusiness(
    businessId:
      string
  ) {
    const response =
      await api.get<StoresResponse>(
        `/businesses/${businessId}/stores`
      );

    return response
      .data
      .data
      .stores;
  },

  /*
   * COMMERCIAL MUTATION
   */
  async create(
    businessId:
      string,

    payload:
      CreateStorePayload
  ) {
    const response =
      await idempotentRequest<StoreResponse>(
        "POST",

        `/businesses/${businessId}/stores`,

        payload
      );

    return response
      .data
      .data
      .store;
  },

  /*
   * Normal metadata mutation.
   */
  async update(
    storeId:
      string,

    payload:
      UpdateStorePayload
  ) {
    const response =
      await api.patch<StoreResponse>(
        `/stores/${storeId}`,

        payload
      );

    return response
      .data
      .data
      .store;
  },

  /*
   * COMMERCIAL MUTATION
   */
  async remove(
    storeId:
      string
  ) {
    await idempotentRequest(
      "DELETE",

      `/stores/${storeId}`
    );
  },
};