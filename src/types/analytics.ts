export type InteractionSource =
  | "NFC"
  | "QR"
  | "UNKNOWN";

export type DashboardAnalyticsRange =
  | "today"
  | "7d"
  | "30d"
  | "custom";

export interface AnalyticsFilters {
  range?:
    DashboardAnalyticsRange;

  timeZone?:
    string;

  businessId?:
    string;

  storeId?:
    string;

  cardId?:
    string;

  from?:
    string;

  to?:
    string;
}

export interface AnalyticsPeriod {
  from:
    string;

  to:
    string;
}

export interface AnalyticsOverview {
  period:
    AnalyticsPeriod;

  totalInteractions:
    number;

  previousInteractions:
    number;

  percentageChange:
    | number
    | null;

  approximateUniqueVisitors:
    number;

  source: {
    nfc:
      number;

    qr:
      number;

    unknown:
      number;
  };
}

export interface TimelinePoint {
  date:
    string;

  total:
    number;

  nfc:
    number;

  qr:
    number;

  unknown:
    number;
}

export interface CardAnalytics {
  id:
    string;

  code:
    string;

  label:
    | string
    | null;

  status:
    | "ACTIVE"
    | "INACTIVE"
    | "UNASSIGNED";

  store:
    | {
        id:
          string;

        name:
          string;

        business: {
          id:
            string;

          name:
            string;
        };
      }
    | null;

  total:
    number;

  nfc:
    number;

  qr:
    number;

  unknown:
    number;
}

export interface StoreAnalytics {
  id:
    string;

  name:
    string;

  address:
    | string
    | null;

  business: {
    id:
      string;

    name:
      string;
  };

  total:
    number;

  nfc:
    number;

  qr:
    number;

  unknown:
    number;
}