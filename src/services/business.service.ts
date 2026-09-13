import {
  api,
} from "@/lib/api";

import type {
  Business,
} from "@/types/business";

type BusinessesResponse = {
  success: boolean;

  data: {
    businesses: Business[];
  };
};

type BusinessResponse = {
  success: boolean;

  data: {
    business: Business;
  };
};

export type CreateBusinessPayload = {
  name: string;

  logoUrl?:
    | string
    | null;
};

export type UpdateBusinessPayload =
  Partial<CreateBusinessPayload>;

export const businessesService = {
  async getAll() {
    const response =
      await api.get<BusinessesResponse>(
        "/businesses"
      );

    return response.data.data
      .businesses;
  },

  async create(
    payload: CreateBusinessPayload
  ) {
    const response =
      await api.post<BusinessResponse>(
        "/businesses",
        payload
      );

    return response.data.data
      .business;
  },

  async update(
    businessId: string,
    payload: UpdateBusinessPayload
  ) {
    const response =
      await api.patch<BusinessResponse>(
        `/businesses/${businessId}`,
        payload
      );

    return response.data.data
      .business;
  },
};