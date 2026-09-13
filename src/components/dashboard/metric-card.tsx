import type {
    LucideIcon,
  } from "lucide-react";
  
  import {
    ArrowDownRight,
    ArrowUpRight,
  } from "lucide-react";
  
  import {
    formatNumber,
  } from "@/lib/format";
  
  type MetricCardProps = {
    title: string;
  
    value: number;
  
    icon: LucideIcon;
  
    change?: number | null;
  
    description?: string;
  };
  
  export function MetricCard({
    title,
    value,
    icon: Icon,
    change,
    description,
  }: MetricCardProps) {
    const positive =
      change !== undefined &&
      change !== null &&
      change >= 0;
  
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/20 hover:shadow-lg">
        <div className="absolute -right-12 -top-12 size-28 rounded-full bg-emerald-500/[0.06] blur-2xl" />
  
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/60">
              <Icon className="size-4 text-emerald-500 dark:text-emerald-400" />
            </div>
  
            {change !==
              undefined && (
              <div
                className={
                  positive
                    ? "flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    : "flex items-center gap-1 text-xs font-medium text-red-500"
                }
              >
                {change ===
                null ? (
                  "—"
                ) : (
                  <>
                    {positive ? (
                      <ArrowUpRight className="size-3.5" />
                    ) : (
                      <ArrowDownRight className="size-3.5" />
                    )}
  
                    {Math.abs(
                      change
                    )}
                    %
                  </>
                )}
              </div>
            )}
          </div>
  
          <div className="mt-7">
            <div className="text-3xl font-semibold tracking-[-0.04em]">
              {formatNumber(
                value
              )}
            </div>
  
            <p className="mt-1 text-sm font-medium">
              {title}
            </p>
  
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }