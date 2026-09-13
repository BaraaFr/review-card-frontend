export type ActionCenterSeverity =
  | "WARNING"
  | "SUCCESS"
  | "INFO";

export type ActionCenterEntityType =
  | "CARD"
  | "LOCATION"
  | "GOOGLE"
  | "SYSTEM";

export type ActionCenterItemType =
  | "CARD_NO_RECENT_ACTIVITY"
  | "CARD_NEVER_USED"
  | "LOCATION_DECLINING"
  | "LOCATION_NO_ACTIVITY"
  | "GOOGLE_REVIEW_URL_MISSING"
  | "GOOGLE_NOT_CONNECTED"
  | "TOP_CARD"
  | "TOP_LOCATION"
  | "ALL_HEALTHY";

export type ActionCenterItem = {
  id:
    string;

  type:
    ActionCenterItemType;

  severity:
    ActionCenterSeverity;

  entityType:
    ActionCenterEntityType;

  entityId:
    string | null;

  title:
    string;

  description:
    string;

  metric: {
    label:
      string;

    value:
      string;
  } | null;
};

export type ActionCenterData = {
  period: {
    days:
      number;
  };

  summary: {
    warningCount:
      number;

    infoCount:
      number;

    highlightCount:
      number;

    healthy:
      boolean;
  };

  warnings:
    ActionCenterItem[];

  highlights:
    ActionCenterItem[];
};

export type ActionCenterResponse = {
  success:
    boolean;

  data:
    ActionCenterData;
};