export type WeeklyReportHealth =
  | "HEALTHY"
  | "NEEDS_ATTENTION";

export type WeeklyReportMetric = {
  label:
    string;

  value:
    string;
};

export type WeeklyReportAttentionItem = {
  id:
    string;

  type:
    string;

  entityType:
    string;

  entityId:
    string | null;

  title:
    string;

  description:
    string;

  metric:
    WeeklyReportMetric |
    null;
};

export type WeeklyReportHighlight = {
  id:
    string;

  type:
    string;

  title:
    string;

  description:
    string;

  metric:
    WeeklyReportMetric |
    null;
};

export type WeeklyReportData = {
  generatedAt:
    string;

  store: {
    id:
      string;

    name:
      string | null;
  };

  period: {
    days:
      number;

    timeZone:
      string;

    from:
      string | null;

    to:
      string | null;
  };

  health:
    WeeklyReportHealth;

  overview: {
    interactions: {
      current:
        number;

      previous:
        number;

      changePercentage:
        number | null;
    };

    visitors: {
      unique:
        number;

      new:
        number;

      returning:
        number;

      newPercentage:
        number;

      returningPercentage:
        number;
    };

    sources: {
      nfc:
        number;

      qr:
        number;

      nfcPercentage:
        number;

      qrPercentage:
        number;
    };
  };

  patterns: {
    averagePerDay:
      number;

    peakDay: {
      weekday:
        string;

      interactions:
        number;
    } | null;

    peakTime: {
      startHour:
        number;

      endHour:
        number;

      label:
        string;

      interactions:
        number;
    } | null;
  };

  performance: {
    bestCard: {
      id:
        string;

      name:
        string | null;

      interactions:
        number;

      uniqueVisitors:
        number;
    } | null;

    bestLocation: {
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
    } | null;
  };

  attention: {
    total:
      number;

    items:
      WeeklyReportAttentionItem[];
  };

  highlights:
    WeeklyReportHighlight[];
};

export type WeeklyReportResponse = {
  success:
    boolean;

  data:
    WeeklyReportData;
};