import {
    CircleCheck,
    CircleDashed,
    CircleOff,
  } from "lucide-react";
  
  import type {
    CardStatus,
  } from "@/types/card";
  
  import {
    Badge,
  } from "@/components/ui/badge";
  
  export function CardStatusBadge({
    status,
  }: {
    status: CardStatus;
  }) {
    if (
      status === "ACTIVE"
    ) {
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <CircleCheck className="size-3" />
  
          Active
        </Badge>
      );
    }
  
    if (
      status ===
      "UNASSIGNED"
    ) {
      return (
        <Badge
          variant="secondary"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        >
          <CircleDashed className="size-3" />
  
          Ready
        </Badge>
      );
    }
  
    return (
      <Badge
        variant="secondary"
        className="bg-muted text-muted-foreground"
      >
        <CircleOff className="size-3" />
  
        Inactive
      </Badge>
    );
  }