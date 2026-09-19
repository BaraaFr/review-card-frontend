"use client";

import {
  CalendarDays,
  CreditCard,
  MapPin,
  RotateCcw,
} from "lucide-react";

import type {
  DashboardAnalyticsRange,
} from "@/types/analytics";

import type {
  ReviewCard,
} from "@/types/card";

import type {
  Store,
} from "@/types/business";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type Props = {
  range: DashboardAnalyticsRange;

  onRangeChange: (
    range: DashboardAnalyticsRange
  ) => void;

  storeId: string;

  onStoreChange: (
    value: string
  ) => void;

  cardId: string;

  onCardChange: (
    value: string
  ) => void;

  stores: Store[];

  cards: ReviewCard[];

  customFrom: string;

  customTo: string;

  onCustomFromChange: (
    value: string
  ) => void;

  onCustomToChange: (
    value: string
  ) => void;

  onApplyCustom: () => void;

  customError?: string;

  maxDate: string;

  onReset: () => void;
};

const ranges: {
  value: DashboardAnalyticsRange;
  label: string;
}[] = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "7d",
    label: "7 days",
  },
  {
    value: "30d",
    label: "30 days",
  },
  {
    value: "custom",
    label: "Custom",
  },
];

export function AnalyticsFilters({
  range,
  onRangeChange,
  storeId,
  onStoreChange,
  cardId,
  onCardChange,
  stores,
  cards,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  onApplyCustom,
  customError,
  maxDate,
  onReset,
}: Props) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <div className="flex flex-col gap-5">
        {/* Range */}
        <div className="flex flex-wrap gap-2">
          {ranges.map(
            (option) => (
              <Button
                key={
                  option.value
                }
                type="button"
                size="sm"
                variant={
                  range ===
                  option.value
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  onRangeChange(
                    option.value
                  )
                }
              >
                {option.value ===
                  "custom" && (
                  <CalendarDays className="size-3.5" />
                )}

                {option.label}
              </Button>
            )
          )}
        </div>

        {/* Resource filters */}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

            <NativeSelect
              value={storeId}
              className="pl-9"
              onChange={(event) =>
                onStoreChange(
                  event
                    .currentTarget
                    .value
                )
              }
            >
              <NativeSelectOption value="">
                All locations
              </NativeSelectOption>

              {stores.map(
                (store) => (
                  <NativeSelectOption
                    key={
                      store.id
                    }
                    value={
                      store.id
                    }
                  >
                    {store.name}
                  </NativeSelectOption>
                )
              )}
            </NativeSelect>
          </div>

          <div className="relative">
            <CreditCard className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

            <NativeSelect
              value={cardId}
              className="pl-9"
              onChange={(event) =>
                onCardChange(
                  event
                    .currentTarget
                    .value
                )
              }
            >
              <NativeSelectOption value="">
                All review cards
              </NativeSelectOption>

              {cards.map(
                (card) => (
                  <NativeSelectOption
                    key={
                      card.id
                    }
                    value={
                      card.id
                    }
                  >
                    {card.label ??
                      "Review Card"}{" "}
                    —{" "}
                    {card.code}
                  </NativeSelectOption>
                )
              )}
            </NativeSelect>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={
              onReset
            }
          >
            <RotateCcw className="size-4" />

            Reset
          </Button>
        </div>

        {/* Custom range */}
        {range ===
          "custom" && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <div className="space-y-2">
                <label
                  htmlFor="analytics-from"
                  className="text-xs font-medium"
                >
                  From
                </label>

                <Input
                  id="analytics-from"
                  type="date"
                  value={
                    customFrom
                  }
                  max={maxDate}
                  onChange={(
                    event
                  ) =>
                    onCustomFromChange(
                      event
                        .target
                        .value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="analytics-to"
                  className="text-xs font-medium"
                >
                  To
                </label>

                <Input
                  id="analytics-to"
                  type="date"
                  value={
                    customTo
                  }
                  max={maxDate}
                  onChange={(
                    event
                  ) =>
                    onCustomToChange(
                      event
                        .target
                        .value
                    )
                  }
                />
              </div>

              <Button
                type="button"
                onClick={
                  onApplyCustom
                }
              >
                Apply range
              </Button>
            </div>

            {customError && (
              <p className="mt-3 text-xs text-destructive">
                {customError}
              </p>
            )}

            <p className="mt-3 text-xs text-muted-foreground">
              Custom analytics can
              cover up to 366 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}