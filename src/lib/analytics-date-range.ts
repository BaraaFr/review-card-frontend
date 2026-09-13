import type {
    AnalyticsCustomRange,
    AnalyticsPreset,
    AnalyticsRange,
  } from "@/types/analytics-filter";
  
  const DAY_MS =
    24 * 60 * 60 * 1000;
  
  const MAX_RANGE_DAYS =
    366;
  
  function pad(
    value: number
  ) {
    return String(
      value
    ).padStart(
      2,
      "0"
    );
  }
  
  export function formatLocalDate(
    date: Date
  ) {
    return `${date.getFullYear()}-${pad(
      date.getMonth() + 1
    )}-${pad(
      date.getDate()
    )}`;
  }
  
  function dateOnlyToUtcDay(
    value: string
  ) {
    const [
      year,
      month,
      day,
    ] =
      value
        .split("-")
        .map(Number);
  
    return Date.UTC(
      year,
      month - 1,
      day
    );
  }
  
  export function getRangeDays(
    from: string,
    to: string
  ) {
    const fromTime =
      dateOnlyToUtcDay(
        from
      );
  
    const toTime =
      dateOnlyToUtcDay(
        to
      );
  
    return (
      Math.floor(
        (
          toTime -
          fromTime
        ) /
          DAY_MS
      ) + 1
    );
  }
  
  export function validateCustomAnalyticsRange(
    range: AnalyticsCustomRange
  ) {
    if (
      !range.from ||
      !range.to
    ) {
      return "Choose both a start and end date.";
    }
  
    if (
      range.from >
      range.to
    ) {
      return "The start date must be before the end date.";
    }
  
    const today =
      formatLocalDate(
        new Date()
      );
  
    if (
      range.to >
      today
    ) {
      return "The end date cannot be in the future.";
    }
  
    const days =
      getRangeDays(
        range.from,
        range.to
      );
  
    if (
      days >
      MAX_RANGE_DAYS
    ) {
      return "Please choose a date range of up to 12 months.";
    }
  
    return null;
  }
  
  export function resolveAnalyticsRange(
    preset: AnalyticsPreset,
    customRange: AnalyticsCustomRange,
    now = new Date()
  ): AnalyticsRange | null {
    const timeZone =
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone ||
      "UTC";
  
    const today =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
  
    let from: Date;
    let to: Date;
  
    switch (
      preset
    ) {
      case "7d": {
        from =
          new Date(
            today
          );
  
        from.setDate(
          from.getDate() -
            6
        );
  
        to =
          today;
  
        break;
      }
  
      case "30d": {
        from =
          new Date(
            today
          );
  
        from.setDate(
          from.getDate() -
            29
        );
  
        to =
          today;
  
        break;
      }
  
      case "this-month": {
        from =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );
  
        to =
          today;
  
        break;
      }
  
      case "last-month": {
        from =
          new Date(
            today.getFullYear(),
            today.getMonth() -
              1,
            1
          );
  
        to =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            0
          );
  
        break;
      }
  
      case "custom": {
        const error =
          validateCustomAnalyticsRange(
            customRange
          );
  
        if (error) {
          return null;
        }
  
        return {
          preset,
          from:
            customRange.from,
          to:
            customRange.to,
          timeZone,
        };
      }
    }
  
    return {
      preset,
      from:
        formatLocalDate(
          from
        ),
      to:
        formatLocalDate(
          to
        ),
      timeZone,
    };
  }