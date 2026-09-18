  export type EngagementInteractionMetrics = {
    current:
      number;
  
    previous:
      number;
  
    changePercentage:
      number | null;
  };
  
  export type EngagementVisitorMetrics = {
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
  
  export type EngagementSourceMetrics = {
    nfc:
      number;
  
    qr:
      number;
  
    unknown:
      number;
  
    nfcPercentage:
      number;
  
    qrPercentage:
      number;
  
    unknownPercentage:
      number;
  };
  
  export type EngagementDeviceMetrics = {
    mobile:
      number;
  
    tablet:
      number;
  
    desktop:
      number;
  
    unknown:
      number;
  
    mobilePercentage:
      number;
  
    tabletPercentage:
      number;
  
    desktopPercentage:
      number;
  
    unknownPercentage:
      number;
  };
  
  export type EngagementAnalytics = {
    period:
      EngagementAnalyticsPeriod;
  
    interactions:
      EngagementInteractionMetrics;
  
    visitors:
      EngagementVisitorMetrics;
  
    sources:
      EngagementSourceMetrics;
  
    devices:
      EngagementDeviceMetrics;
  };
  
  export type EngagementAnalyticsResponse = {
    success:
      boolean;
  
    data:
      EngagementAnalytics;
  };

  export type EngagementAnalyticsPeriod = {
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