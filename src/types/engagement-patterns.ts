export type DailyEngagementTrend = {
    date:
      string;
  
    label:
      string;
  
    weekday:
      string;
  
    interactions:
      number;
  
    uniqueVisitors:
      number;
  };
  
  export type WeekdayEngagement = {
    weekday:
      string;
  
    shortLabel:
      string;
  
    interactions:
      number;
  };
  
  export type HourlyEngagement = {
    hour:
      number;
  
    label:
      string;
  
    interactions:
      number;
  };
  
  export type PeakDay = {
    weekday:
      string;
  
    interactions:
      number;
  };
  
  export type PeakTime = {
    startHour:
      number;
  
    endHour:
      number;
  
    label:
      string;
  
    interactions:
      number;
  };
  
  export type EngagementPatternsData = {
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
  
    summary: {
      totalInteractions:
        number;
  
      totalUniqueVisitors:
        number;
  
      averagePerDay:
        number;
  
      peakDay:
        PeakDay | null;
  
      peakTime:
        PeakTime | null;
    };
  
    dailyTrend:
      DailyEngagementTrend[];
  
    weekdayDistribution:
      WeekdayEngagement[];
  
    hourlyDistribution:
      HourlyEngagement[];
  };
  
  export type EngagementPatternsResponse = {
    success:
      boolean;
  
    data:
      EngagementPatternsData;
  };