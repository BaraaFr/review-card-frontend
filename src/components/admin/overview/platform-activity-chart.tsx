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
  AdminOverview,
} from "@/types/overview";

type Props = {
  data:
    AdminOverview["activity"]["timeline"];
};

export function PlatformActivityChart({
  data,
}: Props) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 8,
            bottom: 0,
            left: -24,
          }}
        >
          <defs>
            <linearGradient
              id="adminActivity"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--chart-1)"
                stopOpacity={
                  0.3
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
            strokeOpacity={
              0.5
            }
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fill:
                "var(--muted-foreground)",
              fontSize: 11,
            }}
            tickFormatter={(
              value
            ) =>
              format(
                parseISO(
                  value
                ),
                "EEE"
              )
            }
          />

          <YAxis
            allowDecimals={
              false
            }
            axisLine={false}
            tickLine={false}
            tick={{
              fill:
                "var(--muted-foreground)",
              fontSize: 11,
            }}
          />

          <Tooltip
            contentStyle={{
              background:
                "var(--popover)",

              color:
                "var(--popover-foreground)",

              border:
                "1px solid var(--border)",

              borderRadius:
                "12px",
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
            name="Interactions"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            fill="url(#adminActivity)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}