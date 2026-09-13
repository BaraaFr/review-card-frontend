import {
  api,
} from "@/lib/api";

import type {
  ActivationResult,
  CreateAdditionalBusinessPayload,
  CreateCustomerPayload,
  Customer,
  CustomerCreationResult,
  CustomerDetail,
} from "@/types/customer";

type CustomersResponse = {
  success: boolean;

  data: {
    customers: Customer[];
  };
};

type CreateCustomerResponse = {
  success: boolean;

  data:
  CustomerCreationResult;
};

type ActivationResponse = {
  success: boolean;

  data: ActivationResult;
};

type CustomerResponse = {
  success: boolean;

  data: {
    customer: CustomerDetail;
  };
};

type AdditionalBusinessResponse = {
  success: boolean;

  data: {
    business:
      CustomerDetail["businesses"][number];

    store: {
      id: string;

      name: string;

      address:
        | string
        | null;

      googleReviewUrl:
        | string
        | null;

      businessId: string;

      createdAt: string;

      updatedAt: string;
    };

    subscription:
      CustomerDetail["businesses"][number]["subscriptions"][number] |
      null;
  };
};

export const customersService = {
  async getAll() {
    const response =
      await api.get<CustomersResponse>(
        "/admin/customers"
      );

    return response.data.data
      .customers;
  },

  async create(
    payload:
      CreateCustomerPayload
  ) {
    const response =
      await api.post<CreateCustomerResponse>(
        "/admin/customers",
        payload
      );

    return response.data.data;
  },

  async resendActivation(
    userId: string
  ) {
    const response =
      await api.post<ActivationResponse>(
        `/admin/customers/${userId}/resend-activation`
      );

    return response.data.data;
  },

  async disable(
    userId: string
  ) {
    const response =
      await api.patch(
        `/admin/customers/${userId}/disable`
      );

    return response.data.data
      .user;
  },

  async enable(
    userId: string
  ) {
    const response =
      await api.patch(
        `/admin/customers/${userId}/enable`
      );

    return response.data.data
      .user;
  },

  async getById(
    userId: string
  ) {
    const response =
      await api.get<CustomerResponse>(
        `/admin/customers/${userId}`
      );
  
    return response.data.data
      .customer;
  },
  
  async createAdditionalBusiness(
    userId: string,
    payload:
      CreateAdditionalBusinessPayload
  ) {
    const response =
      await api.post<AdditionalBusinessResponse>(
        `/admin/customers/${userId}/businesses`,
        payload
      );
  
    return response.data.data;
  },
};