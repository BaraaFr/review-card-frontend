export interface BusinessOwner {
  id: string;
  name: string;
  email: string;
}

export interface Business {
  id: string;
  name: string;

  logoUrl:
    | string
    | null;

  ownerId: string;

  owner?: BusinessOwner;
  stores?:Store[];
  _count?: {
    stores: number;
  };

  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;

  name: string;

  address:
    | string
    | null;

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

  businessId: string;
  
  _count?: {
    cards: number;
    interactions: number;
  };

  createdAt: string;
  updatedAt: string;
}
