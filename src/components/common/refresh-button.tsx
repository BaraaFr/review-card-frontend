"use client";

import { useRef, useState } from "react";

import {
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";

import { RefreshCw } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type RefreshButtonProps = {
  queryKey?: QueryKey;

  queryKeys?: readonly QueryKey[];

  label?: string;

  disabled?: boolean;

  exact?: boolean;

  onRefresh?: () => void | Promise<void>;
};

export function RefreshButton({
  queryKey,
  queryKeys,
  label = "Refresh",
  disabled = false,
  exact = false,
  onRefresh,
}: RefreshButtonProps) {
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] =
    useState(false);

  const refreshingRef = useRef(false);

  const handleRefresh = async () => {
    if (refreshingRef.current || disabled) {
      return;
    }

    const keys: readonly QueryKey[] =
      queryKeys ?? (queryKey ? [queryKey] : []);

    if (keys.length === 0 && !onRefresh) {
      return;
    }

    refreshingRef.current = true;
    setRefreshing(true);

    try {
      /*
       * Refresh only queries matching
       * the supplied keys.
       *
       * Active queries are refetched
       * without clearing their cache.
       */
      await Promise.all(
        keys.map((key) =>
          queryClient.refetchQueries(
            {
              queryKey: key,
              type: "active",
              exact,
            },
            {
              throwOnError: true,
            }
          )
        )
      );

      /*
       * Optional custom refresh action.
       *
       * Useful when a page also needs
       * to refresh something outside
       * React Query.
       */
      await onRefresh?.();
    } catch {
      toast.error(
        "Unable to refresh data. Please try again."
      );
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={
        disabled ||
        refreshing
      }
      onClick={handleRefresh}
      className="h-9 gap-2 bg-background shadow-sm"
      aria-label={label}
    >
      <RefreshCw
        className={
          refreshing
            ? "size-4 animate-spin"
            : "size-4"
        }
      />

      <span className="hidden sm:inline">
        {refreshing
          ? "Refreshing..."
          : label}
      </span>
    </Button>
  );
}