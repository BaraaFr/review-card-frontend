import {
  api,
} from "@/lib/api";

import type {
  GoogleConnectResult,
  GoogleConnectedResult,
  GoogleReputation,
} from "@/types/google-reputation";

export type DisconnectGoogleResponse = {
  alreadyDisconnected:
    boolean;

  store: {
    id: string;

    name: string;

    googleReviewUrl:
      | string
      | null;

    googlePlaceId:
      | string
      | null;

    googlePlaceConnectedFromUrl:
      | string
      | null;

    googlePlaceConnectedAt:
      | string
      | null;
  };
};

export async function disconnectGooglePlace(
  storeId: string
): Promise<DisconnectGoogleResponse> {
  const {
    data,
  } =
    await api.delete(
      `/google/stores/${storeId}/connection`
    );

  return data.data;
}

export async function connectGooglePlace(
  storeId: string
): Promise<GoogleConnectResult> {
  const {
    data,
  } =
    await api.post(
      `/google/stores/${storeId}/connect`
    );

  return data.data;
}

export async function confirmGooglePlace(
  storeId: string,
  input: {
    placeId: string;

    confirmationToken:
      string;
  }
): Promise<GoogleConnectedResult> {
  const {
    data,
  } =
    await api.post(
      `/google/stores/${storeId}/confirm`,
      input
    );

  return data.data;
}

export async function getGoogleReputation(
  storeId: string
): Promise<GoogleReputation> {
  const {
    data,
  } =
    await api.get(
      `/google/stores/${storeId}/reputation`
    );

  return data.data;
}