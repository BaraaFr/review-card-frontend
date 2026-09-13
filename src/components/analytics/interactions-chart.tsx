"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
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

export function InteractionsChart({
  data,
}: {
  data: TimelinePoint[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">
            No interactions yet
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Activity will appear
            here after customers
            interact with your cards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="interactionGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--chart-1)"
                stopOpacity={
                  0.35
                }
              />

              <stop
                offset="95%"
                stopColor="var(--chart-1)"
                stopOpacity={
                  0
                }
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
            tickFormatter={(
              value
            ) =>
              format(
                parseISO(
                  value
                ),
                "MMM d"
              )
            }
            axisLine={false}
            tickLine={false}
            tick={{
              fill:
                "var(--muted-foreground)",
              fontSize: 11,
            }}
            minTickGap={25}
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
            labelFormatter={(
              value
            ) =>
              format(
                parseISO(
                  String(
                    value
                  )
                ),
                "MMM d, yyyy"
              )
            }
          />

          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            fill="url(#interactionGradient)"
            activeDot={{
              r: 5,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}