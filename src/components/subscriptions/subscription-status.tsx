import {
    CircleCheck,
    CircleDashed,
    CircleOff,
    Clock3,
    TriangleAlert,
  } from "lucide-react";
  
  import type {
    SubscriptionStatus,
  } from "@/types/subscription";
  
  import {
    Badge,
  } from "@/components/ui/badge";
  
  export function SubscriptionStatusBadge({
    status,
  }: {
    status: SubscriptionStatus;
  }) {
    switch (status) {
      case "TRIAL":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            <Clock3 className="size-3" />
  
            Trial
          </Badge>
        );
  
      case "ACTIVE":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <CircleCheck className="size-3" />
  
            Active
          </Badge>
        );
  
      case "PAST_DUE":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            <TriangleAlert className="size-3" />
  
            Needs attention
          </Badge>
        );
  
      case "CANCELED":
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground"
          >
            <CircleDashed className="size-3" />
  
            Canceled
          </Badge>
        );
  
      case "EXPIRED":
        return (
          <Badge
            variant="secondary"
            className="bg-red-500/10 text-red-600 dark:text-red-400"
          >
            <CircleOff className="size-3" />
  
            Expired
          </Badge>
        );
    }
  }