"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  Activity,
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  MapPin,
  ScanLine,
  UsersRound,
  WalletCards,
} from "lucide-react";

import {
  useMe,
} from "@/hooks/auth/use-me";

import {
  BusinessSwitcher,
} from "./business-switcher";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserMenu } from "./user-menu";

import {
  Inbox,
} from "lucide-react";
import ValYouLogo from "../landing/valyou-logo";


const ownerNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },

  {
    title: "Businesses",
    href: "/businesses",
    icon: Building2,
  },

  {
    title: "Locations",
    href: "/locations",
    icon: MapPin,
  },

  {
    title: "Review Cards",
    href: "/cards",
    icon: ScanLine,
  },

  {
    title: "Subscription",
    href: "/subscription",
    icon: CreditCard,
  },
];

const adminNavigation = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Customers",
    href: "/admin/customers",
    icon: UsersRound,
  },

  {
    title:
      "Requests",
  
    href:
      "/admin/requests",
  
    icon:
      Inbox,
  },
  {
    title: "Card Inventory",
    href: "/admin/cards",
    icon: WalletCards,
  },

  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  
  {
    title:
      "Operations",
  
    href:
      "/admin/operations",
  
    icon:
      Activity,
  },];

export function AppSidebar() {
  const pathname =
    usePathname();

  const {
    data: user,
  } = useMe();

  const isAdmin =
    user?.role ===
    "SUPER_ADMIN";

  const navigation =
    isAdmin
      ? adminNavigation
      : ownerNavigation;

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
            >
              <Link
                className="p-1"
                href={
                  isAdmin
                    ? "/admin/dashboard"
                    : "/dashboard"
                }
              >
                <ValYouLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!isAdmin && (
          <BusinessSwitcher />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isAdmin
              ? "Platform"
              : "Workspace"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map(
                (item) => {
                  const active =
                    pathname ===
                      item.href ||
                    pathname.startsWith(
                      `${item.href}/`
                    );

                  return (
                    <SidebarMenuItem
                      key={
                        item.href
                      }
                    >
                      <SidebarMenuButton
                        isActive={
                          active
                        }
                        tooltip={
                          item.title
                        }
                      >
                        <Link
                          href={
                            item.href
                          }
                          className="flex items-center gap-2"
                        >
                          <item.icon />

                          <span>
                            {
                              item.title
                            }
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}