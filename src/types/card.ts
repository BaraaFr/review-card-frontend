export type CardStatus =
  | "UNASSIGNED"
  | "ACTIVE"
  | "INACTIVE";

export interface CardUrls {
  redirectUrl: string;

  qrUrl: string;

  nfcUrl: string;
}

export interface CardBusiness {
  id: string;
  name: string;
  ownerId?: string;
}

export type CardPaymentMethod =
  | "CASH"
  | "WHISH"
  | "OTHER";

export interface CardStore {
  id: string;
  name: string;

  businessId?: string;

  business?: CardBusiness;
}

export interface ReviewCard {
  id: string;

  code: string;

  label:
    | string
    | null;

  status: CardStatus;

  storeId:
    | string
    | null;

  store:
    | CardStore
    | null;

  assignedAt:
    | string
    | null;


  salePriceCents:
  | number
  | null;

paidAt:
  | string
  | null;

deliveredAt:
  | string
  | null;

paymentMethod:
  | CardPaymentMethod
  | null;

  createdAt: string;
  updatedAt: string;

  urls: CardUrls;

  _count?: {
    interactions: number;
  };
}

export interface CardsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CardsResult {
  cards: ReviewCard[];

  pagination: CardsPagination;

  summary: {
    ready: number;

    active: number;

    inactive: number;
  };
}