import {
  idempotentRequest,
} from "@/lib/idempotent-request";

import {
  api,
} from "@/lib/api";

import type {
  CardPaymentMethod,
  CardsResult,
  CardStatus,
  ReviewCard,
} from "@/types/card";

export type CardFilters = {
  page?: number;

  limit?: number;

  status?:
    CardStatus;

  businessId?:
    string;

  storeId?:
    string;
};

type CardsResponse = {
  success:
    boolean;

  data:
    CardsResult;
};

type CardResponse = {
  success:
    boolean;

  data: {
    card:
      ReviewCard;
  };
};

export type CreateCardPayload = {
  label?:
    | string
    | null;
};

export type AssignCardPayload = {
  storeId:
    string;

  label?:
    string;
};

export const cardsService = {
  async getAll(
    filters:
      CardFilters
  ) {
    const response =
      await api.get<CardsResponse>(
        "/cards",
        {
          params:
            filters,
        }
      );

    return response
      .data
      .data;
  },

  /*
   * COMMERCIAL MUTATION
   */
  async create(
    payload:
      CreateCardPayload
  ) {
    const response =
      await idempotentRequest<CardResponse>(
        "POST",

        "/cards",

        payload
      );

    return response
      .data
      .data
      .card;
  },

  /*
   * Normal metadata edit.
   *
   * Keep using regular API call.
   */
  async update(
    cardId:
      string,

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

    return response
      .data
      .data
      .card;
  },

  /*
   * COMMERCIAL MUTATION
   */
  async assign(
    cardId:
      string,

    payload:
      AssignCardPayload
  ) {
    const response =
      await idempotentRequest<CardResponse>(
        "POST",

        `/cards/${cardId}/assign`,

        payload
      );

    return response
      .data
      .data
      .card;
  },

  /*
   * COMMERCIAL MUTATION
   */
  async unassign(
    cardId:
      string
  ) {
    const response =
      await idempotentRequest<CardResponse>(
        "POST",

        `/cards/${cardId}/unassign`
      );

    return response
      .data
      .data
      .card;
  },

  async getQrSvg(
    cardId:
      string
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

  /*
   * COMMERCIAL + PAYMENT MUTATION
   */
  async deliver(
    cardId:
      string,

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