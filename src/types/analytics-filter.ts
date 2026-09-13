
export type AnalyticsPreset =
  | "7d"
  | "30d"
  | "this-month"
  | "last-month"
  | "custom";

export type AnalyticsCustomRange = {
  from: string;
  to: string;
};

export type AnalyticsRange = {
  preset: AnalyticsPreset;
  from: string;
  to: string;
  timeZone: string;
};