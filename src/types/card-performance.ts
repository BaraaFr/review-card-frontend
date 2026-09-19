export type CardActivityStatus =
  | "ACTIVE"
  | "NO_RECENT_ACTIVITY"
  | "NEVER_USED";

export type CardPerformanceItem = {
  id:
  string;

  label:
  string | null;

  code:
  string;

  cardStatus:
  string;

  meaningfulInteractions:
  number;

  uniqueVisitors:
  number;

  duplicateTaps:
  number;

  sharePercentage:
  number;

  lastInteractionAt:
  string | null;

  activityStatus:
  CardActivityStatus;
};

export type CardPerformanceBestCard = {
  id:
  string;

  label:
  string | null;

  code:
  string;

  meaningfulInteractions:
  number;

  uniqueVisitors:
  number;
};

export type CardPerformanceData = {
  period: {
    days:
    number;

    from:
    string;

    previousFrom: string;
    previousTo: string;

    to:
    string;

    timeZone:
    string;
  };

  summary: {
    totalCards:
    number;

    activeCards:
    number;

    cardsWithActivity:
    number;

    cardsNeedingAttention:
    number;

    totalInteractions:
    number;

    totalUniqueVisitors:
    number;

    bestCard:
    CardPerformanceBestCard |
    null;
  };

  cards:
  CardPerformanceItem[];
};

export type CardPerformanceResponse = {
  success:
  boolean;

  data:
  CardPerformanceData;
};