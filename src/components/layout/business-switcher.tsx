"use client";

import { useEffect } from "react";

import {
  Building2,
  Check,
  ChevronsUpDown,
} from "lucide-react";

import {
  useBusinessStore,
} from "@/stores/business.store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useBusinesses } from "@/hooks/business/use-businesses";

export function BusinessSwitcher() {
  const {
    data: businesses = [],
    isLoading,
  } = useBusinesses();

  const {
    businessId,
    setBusinessId,
  } = useBusinessStore();

  useEffect(() => {
    if (
      !businessId &&
      businesses.length > 0
    ) {
      setBusinessId(
        businesses[0].id
      );
    }
  }, [
    businessId,
    businesses,
    setBusinessId,
  ]);

  const selected =
    businesses.find(
      (business) =>
        business.id ===
        businessId
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[popup-open]:bg-sidebar-accent"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-400 text-zinc-950">
              <Building2 className="size-4" />
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {isLoading
                  ? "Loading..."
                  : selected?.name ??
                    "No business"}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                Workspace
              </span>
            </div>

            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={4}
            className="min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Businesses
              </DropdownMenuLabel>

              {businesses.map(
                (business) => (
                  <DropdownMenuItem
                    key={
                      business.id
                    }
                    onClick={() =>
                      setBusinessId(
                        business.id
                      )
                    }
                    className="gap-2"
                  >
                    <Building2 className="size-4" />

                    <span className="flex-1 truncate">
                      {
                        business.name
                      }
                    </span>

                    {businessId ===
                      business.id && (
                      <Check className="size-4 text-emerald-400" />
                    )}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuGroup>

            {/* <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={
                  <Link href="/businesses" />
                }
              >
                <Plus className="size-4" />

                Add business
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}