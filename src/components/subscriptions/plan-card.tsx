import {
    Building2,
    Check,
    Radio,
    Sparkles,
  } from "lucide-react";
  
  import type {
    PlanDefinition,
  } from "@/lib/subscription-plans";
  
  import type {
    SubscriptionPlan,
  } from "@/types/subscription";
  
  import {
    Badge,
  } from "@/components/ui/badge";
  
  type Props = {
    plan: PlanDefinition;
  
    currentPlan:
      | SubscriptionPlan
      | null;
  };
  
  export function PlanCard({
    plan,
    currentPlan,
  }: Props) {
    const current =
      currentPlan ===
      plan.id;
  
    return (
      <div
        className={`
          relative
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-2xl
          border
          bg-card/70
          p-6
          shadow-sm
          transition-all
          ${
            current
              ? "border-emerald-500/35 shadow-emerald-500/5"
              : "border-border/70 hover:border-emerald-500/20"
          }
        `}
      >
        {plan.recommended && (
          <div className="absolute right-0 top-0 rounded-bl-xl bg-emerald-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            Popular
          </div>
        )}
  
        <div className="flex items-center justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
            {plan.id ===
            "PRO" ? (
              <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Radio className="size-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
  
          {current && (
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <Check className="size-3" />
  
              Current
            </Badge>
          )}
        </div>
  
        <div className="mt-6">
          <h3 className="text-xl font-semibold">
            {plan.name}
          </h3>
  
          <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {plan.description}
          </p>
        </div>
  
        <div className="mt-7 space-y-3">
          <PlanFeature
            icon={Building2}
          >
            Up to{" "}
            <strong>
              {plan.stores}
            </strong>{" "}
            {plan.stores === 1
              ? "location"
              : "locations"}
          </PlanFeature>
  
          <PlanFeature
            icon={Radio}
          >
            Up to{" "}
            <strong>
              {plan.cards}
            </strong>{" "}
            active review cards
          </PlanFeature>
  
          <PlanFeature
            icon={Check}
          >
            NFC & dynamic QR
          </PlanFeature>
  
          <PlanFeature
            icon={Check}
          >
            Interaction analytics
          </PlanFeature>
        </div>
  
        <div className="mt-auto pt-8">
          {current ? (
            <div className="rounded-xl bg-muted/60 px-4 py-3 text-center text-sm font-medium text-muted-foreground">
              Your current plan
            </div>
          ) : (
            <div className="rounded-xl border border-border/70 px-4 py-3 text-center text-sm text-muted-foreground">
              Contact ValYou to
              change plan
            </div>
          )}
        </div>
      </div>
    );
  }
  
  function PlanFeature({
    icon: Icon,
    children,
  }: {
    icon: React.ElementType;
  
    children:
      React.ReactNode;
  }) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
  
        <span>
          {children}
        </span>
      </div>
    );
  }