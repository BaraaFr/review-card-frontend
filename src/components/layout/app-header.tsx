"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",

  "/analytics": "Analytics",

  "/businesses": "Businesses",

  "/locations": "Locations",

  "/cards": "Review Cards",

  "/subscription": "Subscription",

  "/admin/dashboard": "Platform Overview",

  "/admin/businesses": "Businesses",

  "/admin/cards": "Card Inventory",

  "/admin/subscriptions": "Subscriptions",
};

export function AppHeader() {
  const pathname = usePathname();

  const title = pageNames[pathname] ?? "ValYou";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.05] bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="-ml-1" />

      <Separator orientation="vertical" className="h-5" />

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-medium">{title}</h1>
      </div>
      <div className="flex gap-2 items-center">
      <ThemeToggle />
      <UserMenu position="bottom" />

      </div>
    </header>
  );
}
