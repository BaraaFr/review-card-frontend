export type LocationPerformanceStatus =
  | "GROWING"
  | "STABLE"
  | "DECLINING"
  | "NO_ACTIVITY"
  | "NEW";

export type LocationPerformanceItem = {
  id:
  string;

  name:
  string | null;

  isSelected:
  boolean;

  currentInteractions:
  number;

  previousInteractions:
  number;

  changePercentage:
  number | null;

  uniqueVisitors:
  number;

  activityShare:
  number;

  lastInteractionAt:
  string | null;

  status:
  LocationPerformanceStatus;
};

export type BestLocation = {
  id:
  string;

  name:
  string | null;

  interactions:
  number;

  uniqueVisitors:
  number;

  changePercentage:
  number | null;
};

export type LocationPerformanceData = {
  period: {
    days:
    number;

    from:
    string;

    to:
    string;

    previousFrom:
    string;

    previousTo:
    string;

    timeZone:
    string;
  };

  summary: {
    totalLocations:
    number;

    locationsWithActivity:
    number;

    locationsNeedingAttention:
    number;

    totalInteractions:
    number;

    totalUniqueVisitors:
    number;

    bestLocation:
    BestLocation |
    null;
  };

  locations:
  LocationPerformanceItem[];
};

export type LocationPerformanceResponse = {
  success:
  boolean;

  data:
  LocationPerformanceData;
};