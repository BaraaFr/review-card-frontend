export type WeeklyReportDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type WeeklyReportSettings = {
  enabled:
    boolean;

  day:
    WeeklyReportDay;

  time:
    string;

  timeZone:
    string;

  email:
    string | null;

  defaultEmail:
    string;

  lastSentAt:
    string | null;
};

export type WeeklyReportSettingsResponse = {
  success:
    boolean;

  data:
    WeeklyReportSettings;
};