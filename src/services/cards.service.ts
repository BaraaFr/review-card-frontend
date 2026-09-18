import {
  api,
} from "@/lib/api";

import type {
  CardPaymentMethod,
  CardsResult,
  CardStatus,
  ReviewCard,
} from "@/types/card";

import {
  idempotentRequest,
} from "@/lib/idempotent-request";

export type CardFilters = {
  page?: number;
  limit?: number;

  status?: CardStatus;

  businessId?: string;

  storeId?: string;
};

type CardsResponse = {
  success: boolean;

  data: CardsResult;
};

type CardResponse = {
  success: boolean;

  data: {
    card: ReviewCard;
  };
};

export type CreateCardPayload = {
  label?:
  | string
  | null;
};

export type AssignCardPayload = {
  storeId: string;

  label?: string;
};

export const cardsService = {
  async getAll(
    filters: CardFilters
  ) {
    const response =
      await api.get<CardsResponse>(
        "/cards",
        {
          params: filters,
        }
      );

    return response.data.data;
  },

  async create(
    payload: CreateCardPayload
  ) {
    const response =
      await api.post<CardResponse>(
        "/cards",
        payload
      );

    return response.data.data
      .card;
  },

  async update(
    cardId: string,
    payload: {
      label?:
      | string
      | null;
    }
  ) {
    const response =
      await api.patch<CardResponse>(
        `/cards/${cardId}`,
        payload
      );

    return response.data.data
      .card;
  },

  async assign(
    cardId: string,
    payload: AssignCardPayload
  ) {
    const response =
      await api.post<CardResponse>(
        `/cards/${cardId}/assign`,
        payload
      );

    return response.data.data
      .card;
  },

  async unassign(
    cardId: string
  ) {
    const response =
      await api.post<CardResponse>(
        `/cards/${cardId}/unassign`
      );

    return response.data.data
      .card;
  },

  async getQrSvg(
    cardId: string
  ) {
    const response =
      await api.get<Blob>(
        `/cards/${cardId}/qr`,
        {
          responseType:
            "blob",
        }
      );

    return response.data;
  },

  async deliver(
    cardId: string,

    paymentMethod:
      CardPaymentMethod,

    receiptReference:
      string
  ) {
    const response =
      await idempotentRequest<CardResponse>(
        "POST",

        `/cards/${cardId}/deliver`,

        {
          paymentMethod,

          receiptReference,
        }
      );

    return response
      .data
      .data
      .card;
  },
};

