"use client";

import Link from "next/link";

import {
  ChevronsUpDown,
  Loader2,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import { useMe } from "@/hooks/auth/use-me";

import { useLogout } from "@/hooks/auth/use-logout";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type UserMenuProps = {
  position?: "left" | "right" | "top" | "bottom";
};

export function UserMenu({ position = "right" }: UserMenuProps) {
  const { data: user } = useMe();

  const logout = useLogout();

  if (!user) {
    return null;
  }

  /*
   * =====================================================
   * User display values
   * =====================================================
   */

  const displayName = user.name?.trim() || "ValYou User";

  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase() ||
    user.email?.slice(0, 2).toUpperCase() ||
    "VU";

  const roleLabel =
    user.role === "SUPER_ADMIN" ? "Super Admin" : "Business Owner";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* =============================================
              Trigger
          ============================================= */}

          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="
                  h-auto min-h-14
                  rounded-xl
                  border border-transparent
                  px-2.5 py-2
                  transition-all
                  hover:border-sidebar-border
                  hover:bg-sidebar-accent/70
                  data-[popup-open]:border-emerald-200/70
                  data-[popup-open]:bg-emerald-50/70
                  data-[popup-open]:shadow-sm
                  dark:data-[popup-open]:border-emerald-900/60
                  dark:data-[popup-open]:bg-emerald-950/20
                "
              />
            }
          >
            {/* Avatar */}

            <Avatar className="size-9 shrink-0 rounded-xl">
              <AvatarFallback
                className="
                  rounded-xl
                  border border-emerald-200/70
                  bg-emerald-50
                  text-xs font-semibold
                  text-emerald-700
                  dark:border-emerald-900/60
                  dark:bg-emerald-950/40
                  dark:text-emerald-400
                "
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* User info */}

            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold">
                {displayName}
              </span>

              <span className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {roleLabel}
              </span>
            </div>

            <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          {/* =============================================
              Content
          ============================================= */}

          <DropdownMenuContent
            side={position}
            align="start"
            sideOffset={8}
            className="
              w-[280px]
              overflow-hidden
              rounded-xl
              border-border/60
              p-1.5
              shadow-lg
            "
          >
            {/* ===========================================
                Account header
            =========================================== */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div
                  className="
                  rounded-lg
                  bg-gradient-to-br
                  from-emerald-50/80
                  via-background
                  to-background
                  p-3
                  dark:from-emerald-950/30
                "
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0 rounded-xl">
                      <AvatarFallback
                        className="
                        rounded-xl
                        border border-emerald-200/70
                        bg-emerald-50
                        text-sm font-semibold
                        text-emerald-700
                        dark:border-emerald-900/60
                        dark:bg-emerald-950/40
                        dark:text-emerald-400
                      "
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {displayName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Role */}

                  <div
                    className="
                    mt-3 flex
                    w-fit
                    items-center
                    gap-1.5
                    rounded-md
                    border
                    border-emerald-200/70
                    bg-emerald-50
                    px-2 py-1
                    text-[11px]
                    font-medium
                    text-emerald-700
                    dark:border-emerald-900/60
                    dark:bg-emerald-950/30
                    dark:text-emerald-400
                  "
                  >
                    <ShieldCheck className="size-3.5" />

                    {roleLabel}
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1.5" />

            {/* ===========================================
                Navigation
            =========================================== */}

            <DropdownMenuGroup>
              {user.role !== "SUPER_ADMIN" && (
                <DropdownMenuItem
                  render={<Link href="/settings" />}
                  className="
                  min-h-10
                  cursor-pointer
                  gap-3
                  rounded-lg
                  px-3
                "
                >
                  <div
                    className="
                    flex size-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-muted/70
                    text-muted-foreground
                  "
                  >
                    <Settings className="size-3.5" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Settings</span>

                    <span className="text-[11px] text-muted-foreground">
                      Business preferences
                    </span>
                  </div>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                render={
                  <Link
                    href={
                      user.role !== "SUPER_ADMIN"
                        ? "/profile"
                        : "/admin/profile"
                    }
                  />
                }
                className="
                  min-h-10
                  cursor-pointer
                  gap-3
                  rounded-lg
                  px-3
                "
              >
                <div
                  className="
                    flex size-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-muted/70
                    text-muted-foreground
                  "
                >
                  <User className="size-3.5" />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium">Profile</span>

                  <span className="text-[11px] text-muted-foreground">
                    User Profile
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5" />

            {/* ===========================================
                Logout
            =========================================== */}

            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                disabled={logout.isPending}
                onClick={() => {
                  logout.mutate();
                }}
                className="
                  min-h-10
                  cursor-pointer
                  gap-3
                  rounded-lg
                  px-3
                "
              >
                <div
                  className="
                    flex size-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-destructive/10
                    text-destructive
                  "
                >
                  {logout.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <LogOut className="size-3.5" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {logout.isPending ? "Signing out..." : "Sign out"}
                  </span>

                  {!logout.isPending && (
                    <span className="text-[11px] text-muted-foreground">
                      End your current session
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
