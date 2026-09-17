
export type AccountRequestStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CONVERTED"
  | "CLOSED";

export type PublicAccountRequestInput = {
  ownerName: string;
  email:string;
  phone: string;

  shopName: string;

  businessType?:
    | string
    | null;

  requestedCards: number;

  message?:
    | string
    | null;

  website?: string;
};

export type AccountRequest = {
  id: string;

  ownerName: string;
  email:string;
  phone: string;

  shopName: string;

  businessType:
    | string
    | null;

  requestedCards: number;

  message:
    | string
    | null;

  status:
    AccountRequestStatus;

  adminNote:
    | string
    | null;

  handledById:
    | string
    | null;

  contactedAt:
    | string
    | null;

  createdAt: string;

  updatedAt: string;
};

export type AccountRequestSummary = {
  NEW: number;

  CONTACTED: number;

  QUALIFIED: number;

  CONVERTED: number;

  CLOSED: number;
};

export type AdminAccountRequestList = {
  items:
    AccountRequest[];

  meta: {
    page: number;

    perPage:
      number;

    total:
      number;

    totalPages:
      number;
  };

  summary:
    AccountRequestSummary;
};