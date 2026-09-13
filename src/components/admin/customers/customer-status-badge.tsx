import {
    CircleCheck,
    CircleDashed,
    CircleOff,
  } from "lucide-react";
  
  import type {
    CustomerStatus,
  } from "@/types/customer";
  
  import {
    Badge,
  } from "@/components/ui/badge";
  
  export function CustomerStatusBadge({
    status,
  }: {
    status: CustomerStatus;
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
      status === "PENDING"
    ) {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        >
          <CircleDashed className="size-3" />
  
          Pending activation
        </Badge>
      );
    }
  
    return (
      <Badge
        variant="secondary"
        className="bg-red-500/10 text-red-600 dark:text-red-400"
      >
        <CircleOff className="size-3" />
  
        Disabled
      </Badge>
    );
  }