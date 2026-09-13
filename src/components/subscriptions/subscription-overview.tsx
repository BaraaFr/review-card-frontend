import {
    CalendarDays,
    Crown,
  } from "lucide-react";
  
  import type {
    Subscription,
  } from "@/types/subscription";
  
  import {
    formatSubscriptionDate,
    getEffectiveSubscriptionStatus,
    getSubscriptionDaysRemaining,
  } from "@/lib/subscription";
  
  import {
    SubscriptionStatusBadge,
  } from "./subscription-status";
  
  export function SubscriptionOverview({
    subscription,
  }: {
    subscription: Subscription;
  }) {
    const status =
      getEffectiveSubscriptionStatus(
        subscription
      );
  
    const daysRemaining =
      getSubscriptionDaysRemaining(
        subscription
      );
  
    const planName =
      subscription.plan
        .charAt(0) +
      subscription.plan
        .slice(1)
        .toLowerCase();
  
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute -right-32 -top-32 size-72 rounded-full bg-emerald-500/[0.08] blur-[90px]" />
  
        <div className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-violet-500/[0.05] blur-[100px]" />
  
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Crown className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
  
              <SubscriptionStatusBadge
                status={
                  status
                }
              />
            </div>
  
            <div className="mt-7">
              <p className="text-sm text-muted-foreground">
                Current plan
              </p>
  
              <h3 className="mt-1 text-4xl font-semibold tracking-[-0.045em]">
                {planName}
              </h3>
            </div>
  
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Your plan determines
              how many locations and
              physical review cards
              can be active in your
              workspace.
            </p>
          </div>
  
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
            <InfoBox
              label={
                status ===
                "TRIAL"
                  ? "Trial ends"
                  : "Valid until"
              }
              value={
                formatSubscriptionDate(
                  subscription.expiresAt
                )
              }
              icon={
                CalendarDays
              }
            />
  
            <InfoBox
              label="Time remaining"
              value={
                daysRemaining ===
                null
                  ? "No expiry"
                  : daysRemaining ===
                      0
                    ? "Ends today"
                    : `${daysRemaining} ${
                        daysRemaining ===
                        1
                          ? "day"
                          : "days"
                      }`
              }
              icon={
                Crown
              }
            />
          </div>
        </div>
      </div>
    );
  }
  
  function InfoBox({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
  
    value: string;
  
    icon: React.ElementType;
  }) {
    return (
      <div className="rounded-2xl border border-border/70 bg-background/50 p-4 backdrop-blur">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="size-3.5" />
  
          {label}
        </div>
  
        <p className="mt-2 text-sm font-semibold">
          {value}
        </p>
      </div>
    );
  }