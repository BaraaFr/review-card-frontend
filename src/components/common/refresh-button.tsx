"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RefreshButton() {
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (refreshing) {
      return;
    }

    try {
      setRefreshing(true);

      /*
       * Refresh every currently active
       * React Query request on this page.
       *
       * This includes things such as:
       *
       * - analytics
       * - subscription
       * - locations
       * - Google reputation
       * - data report
       *
       * without clearing the cache.
       */
      await queryClient.refetchQueries({
        queryKey: ["analytics"],
        type: "active",
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={refreshing}
      onClick={handleRefresh}
      className="h-8 gap-2 bg-background shadow-sm"
      aria-label="Refresh page data"
    >
      <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />

      <span className="hidden sm:inline">
        {refreshing ? "Refreshing..." : "Refresh"}
      </span>
    </Button>
  );
}
