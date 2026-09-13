export type GoogleReview = {
  id: string;

  rating: number;

  text: string;

  originalText:
    | string
    | null;

  author: {
    name: string;

    profileUrl:
      | string
      | null;

    photoUrl:
      | string
      | null;
  };

  publishedAt: string;

  relativeTime:
    | string
    | null;

  googleMapsUrl:
    | string
    | null;
};

export type GoogleReputation = {
  connected: boolean;

  reason?:
    | "NOT_CONNECTED"
    | "RECONNECT_REQUIRED"
    | null;

  placeId?: string;

  businessName?: string;

  address?:
    | string
    | null;

  rating?:
    | number
    | null;

  reviewCount?: number;

  googleMapsUrl?:
    | string
    | null;

  reviews?: GoogleReview[];
};

export type GoogleConnectionCandidate = {
  placeId: string;

  name: string;

  address:
    | string
    | null;
};

export type GoogleConnectedResult = {
  status:
    "CONNECTED";

  connectionMode:
    | "EXACT_URL"
    | "CONFIRMED";

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

  googlePlace: {
    id: string;

    name:
      | string
      | null;

    address:
      | string
      | null;
  };
};

export type GoogleConfirmationRequiredResult = {
  status:
    "CONFIRMATION_REQUIRED";

  confirmationToken:
    string;

  candidates:
    GoogleConnectionCandidate[];
};

export type GoogleNotFoundResult = {
  status:
    "NOT_FOUND";
};

export type GoogleConnectResult =
  | GoogleConnectedResult
  | GoogleConfirmationRequiredResult
  | GoogleNotFoundResult;