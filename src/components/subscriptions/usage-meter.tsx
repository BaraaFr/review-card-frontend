import type {
    LucideIcon,
  } from "lucide-react";
  
  import {
    calculateUsagePercentage,
  } from "@/lib/subscription";
  
  import {
    Progress,
  } from "@/components/ui/progress";
  
  type Props = {
    title: string;
  
    description: string;
  
    icon: LucideIcon;
  
    used: number;
  
    limit: number;
  };
  
  export function UsageMeter({
    title,
    description,
    icon: Icon,
    used,
    limit,
  }: Props) {
    const percentage =
      calculateUsagePercentage(
        used,
        limit
      );
  
    const full =
      used >= limit;
  
    return (
      <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
  
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold">
                  {title}
                </h3>
  
                <p className="mt-1 text-xs text-muted-foreground">
                  {
                    description
                  }
                </p>
              </div>
  
              <div className="shrink-0 text-right">
                <span className="text-xl font-semibold">
                  {used}
                </span>
  
                <span className="text-sm text-muted-foreground">
                  {" "}
                  / {limit}
                </span>
              </div>
            </div>
  
            <Progress
              value={
                percentage
              }
              className="mt-5"
            />
  
            <div className="mt-2 flex justify-between text-xs">
              <span
                className={
                  full
                    ? "font-medium text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground"
                }
              >
                {full
                  ? "Limit reached"
                  : `${limit - used} remaining`}
              </span>
  
              <span className="text-muted-foreground">
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }