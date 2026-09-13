"use client";

import {
  useEffect,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useMe,
} from "@/hooks/auth/use-me";

import type {
  UserRole,
} from "@/types/auth";

import {
  Loader2,
} from "lucide-react";

type AuthGuardProps = {
  children: React.ReactNode;

  roles?: UserRole[];
};

export function AuthGuard({
  children,
  roles,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname =
    usePathname();

  const {
    data: user,
    isLoading,
    isError,
  } = useMe();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (
      isError ||
      !user
    ) {
      const next =
        encodeURIComponent(
          pathname
        );

      router.replace(
        `/login?next=${next}`
      );

      return;
    }

    if (
      roles &&
      !roles.includes(
        user.role
      )
    ) {
      if (
        user.role ===
        "SUPER_ADMIN"
      ) {
        router.replace(
          "/admin/dashboard"
        );

        return;
      }

      router.replace(
        "/dashboard"
      );
    }
  }, [
    user,
    isLoading,
    isError,
    roles,
    router,
    pathname,
  ]);

  if (
    isLoading ||
    !user
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl border bg-card shadow-sm">
            <Loader2 className="size-5 animate-spin text-emerald-400" />
          </div>

          <p className="text-sm text-muted-foreground">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (
    roles &&
    !roles.includes(
      user.role
    )
  ) {
    return null;
  }

  return children;
}