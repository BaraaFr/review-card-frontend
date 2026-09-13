import type {
    LucideIcon,
  } from "lucide-react";
  
  export function SubscriptionStatCard({
    title,
    value,
    icon: Icon,
    description,
  }: {
    title: string;
  
    value: number;
  
    icon: LucideIcon;
  
    description?: string;
  }) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
  
          <span className="text-3xl font-semibold tracking-[-0.04em]">
            {value}
          </span>
        </div>
  
        <p className="mt-5 text-sm font-medium">
          {title}
        </p>
  
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    );
  }