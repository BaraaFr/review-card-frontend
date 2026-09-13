"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  Clock3,
  Loader2,
  Mail,
  Send,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import {
  Switch,
} from "@/components/ui/switch";

import {
  useSendTestWeeklyReport,
  useUpdateWeeklyReportSettings,
  useWeeklyReportSettings,
} from "@/hooks/settings/use-weekly-report-settings";

import type {
  WeeklyReportDay,
} from "@/types/weekly-report-settings";

type WeeklyReportSettingsProps = {
  businessId:
    string;
};

const DAY_OPTIONS: {
  value:
    WeeklyReportDay;

  label:
    string;
}[] = [
  {
    value:
      "MONDAY",

    label:
      "Monday",
  },
  {
    value:
      "TUESDAY",

    label:
      "Tuesday",
  },
  {
    value:
      "WEDNESDAY",

    label:
      "Wednesday",
  },
  {
    value:
      "THURSDAY",

    label:
      "Thursday",
  },
  {
    value:
      "FRIDAY",

    label:
      "Friday",
  },
  {
    value:
      "SATURDAY",

    label:
      "Saturday",
  },
  {
    value:
      "SUNDAY",

    label:
      "Sunday",
  },
];

export function WeeklyReportSettings({
  businessId,
}: WeeklyReportSettingsProps) {
  const {
    data,
    isLoading,
  } =
    useWeeklyReportSettings(
      businessId
    );

  const updateMutation =
    useUpdateWeeklyReportSettings(
      businessId
    );

  const [
    enabled,
    setEnabled,
  ] =
    useState(
      true
    );

  const [
    day,
    setDay,
  ] =
    useState<WeeklyReportDay>(
      "MONDAY"
    );

  const [
    time,
    setTime,
  ] =
    useState(
      "09:00"
    );

  const [
    timeZone,
    setTimeZone,
  ] =
    useState(
      "UTC"
    );

  const [
    email,
    setEmail,
  ] =
    useState(
      ""
    );

  const [
    message,
    setMessage,
  ] =
    useState<
      string | null
    >(
      null
    );

  useEffect(
    () => {
      if (!data) {
        return;
      }

      setEnabled(
        data.enabled
      );

      setDay(
        data.day
      );

      setTime(
        data.time
      );

      setTimeZone(
        data.timeZone
      );

      setEmail(
        data.email ??
          ""
      );
    },
    [
      data,
    ]
  );

  if (
    isLoading
  ) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-7 w-48" />

          <Skeleton className="h-20 rounded-xl" />

          <Skeleton className="h-20 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  async function handleSave() {
    setMessage(
      null
    );

    try {
      await updateMutation
        .mutateAsync({
          enabled,
          day,
          time,
          timeZone,

          email:
            email.trim() ||
            null,
        });

      setMessage(
        "Weekly report settings saved."
      );
    } catch {
      setMessage(
        "Unable to save weekly report settings."
      );
    }
  }

  function useBrowserTimeZone() {
    const browserTimeZone =
      Intl
        .DateTimeFormat()
        .resolvedOptions()
        .timeZone;

    if (
      browserTimeZone
    ) {
      setTimeZone(
        browserTimeZone
      );
    }
  }

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-50/50 via-background to-background dark:from-emerald-950/20">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Mail className="size-5" />
          </div>

          <div>
            <CardTitle className="text-base">
              Weekly ValYou Report
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Receive a weekly summary of customer engagement, top performers, and items that need attention.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-5 sm:p-6">
        {/* Enable */}

        <div className="flex items-center justify-between gap-5 rounded-xl border border-border/60 p-4">
          <div>
            <p className="text-sm font-medium">
              Send weekly reports
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              ValYou will automatically send your business summary every week.
            </p>
          </div>

          <Switch
            checked={
              enabled
            }
            onCheckedChange={
              setEnabled
            }
          />
        </div>

        {/* Schedule */}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              <CalendarDays className="mr-2 inline size-4" />
              Delivery day
            </Label>

            <Select
              value={
                day
              }
              onValueChange={(
                value,
                _eventDetails
              ) => {
                if (
                  value !==
                  null
                ) {
                  setDay(
                    value as WeeklyReportDay
                  );
                }
              }}
            >
              <SelectTrigger className={'w-full'}>
                <SelectValue />
              </SelectTrigger>

              <SelectContent >
                {DAY_OPTIONS.map(
                  (
                    option
                  ) => (
                    <SelectItem
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekly-report-time">
              <Clock3 className="mr-2 inline size-4" />
              Delivery time
            </Label>

            <Input
              id="weekly-report-time"
              type="time"
              value={
                time
              }
              onChange={(
                event
              ) =>
                setTime(
                  event.target
                    .value
                )
              }
            />
          </div>
        </div>

        {/* Timezone */}

        <div className="space-y-2">
          <Label htmlFor="weekly-report-timezone">
            Timezone
          </Label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="weekly-report-timezone"
              value={
                timeZone
              }
              onChange={(
                event
              ) =>
                setTimeZone(
                  event.target
                    .value
                )
              }
              placeholder="Europe/London"
            />

            <Button
              type="button"
              variant="outline"
              onClick={
                useBrowserTimeZone
              }
            >
              Use my timezone
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Use an IANA timezone such as Europe/London, America/New_York, or Asia/Dubai.
          </p>
        </div>

        {data?.lastSentAt && (
          <p className="text-xs text-muted-foreground">
            Last automatic report:{" "}
            {new Date(
              data.lastSentAt
            ).toLocaleString()}
          </p>
        )}

        {message && (
          <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:justify-between">

          <Button
            type="button"
            disabled={
              updateMutation.isPending
            }
            onClick={
              handleSave
            }
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}

            Save settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}