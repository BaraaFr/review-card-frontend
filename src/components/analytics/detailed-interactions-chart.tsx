"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  format,
  parseISO,
} from "date-fns";

import type {
  TimelinePoint,
} from "@/types/analytics";

export function DetailedInteractionsChart({
  data,
}: {
  data: TimelinePoint[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[380px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">
            No activity for this period
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Try another date range, location, or card.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <LegendItem
          variable="--chart-1"
          label="Total"
        />

        <LegendItem
          variable="--chart-2"
          label="NFC"
        />

        <LegendItem
          variable="--chart-3"
          label="QR"
        />
      </div>

      <div className="h-[380px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 12,
              bottom: 0,
              left: -20,
            }}
          >
            <defs>
              <linearGradient
                id="analyticsTotalGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.5}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              minTickGap={24}
              tick={{
                fill:
                  "var(--muted-foreground)",
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                format(
                  parseISO(value),
                  "MMM d"
                )
              }
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill:
                  "var(--muted-foreground)",
                fontSize: 11,
              }}
            />

            <Tooltip
              cursor={{
                stroke:
                  "var(--border)",
              }}
              contentStyle={{
                background:
                  "var(--popover)",
                border:
                  "1px solid var(--border)",
                borderRadius:
                  "12px",
                color:
                  "var(--popover-foreground)",
              }}
              labelFormatter={(value) =>
                format(
                  parseISO(
                    String(value)
                  ),
                  "MMM d, yyyy"
                )
              }
            />

            <Area
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#analyticsTotalGradient)"
            />

            <Line
              type="monotone"
              dataKey="nfc"
              name="NFC"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
              }}
            />

            <Line
              type="monotone"
              dataKey="qr"
              name="QR"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendItem({
  variable,
  label,
}: {
  variable: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="size-2 rounded-full"
        style={{
          backgroundColor:
            `var(${variable})`,
        }}
      />

      {label}
    </div>
  );
}