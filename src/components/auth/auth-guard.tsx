"use client";

import { useEffect } from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useMe } from "@/hooks/auth/use-me";

import {
  isTerminalAuthError,
} from "@/lib/api";

import {
  getApiErrorRequestId,
} from "@/lib/api-error";

import { Button } from "@/components/ui/button";

import type { UserRole } from "@/types/auth";

type AuthGuardProps = {
  children: React.ReactNode;
  roles?: UserRole[];
};

export function AuthGuard({
  children,
  roles,
}: AuthGuardProps) {
  const router = useRouter();

  const pathname = usePathname();

  const {
    data: user,
    error,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useMe();

  const terminalError =
    isError &&
    isTerminalAuthError(error);

  /*
   * No authenticated user was returned.
   *
   * This is different from a temporary
   * network/server error.
   */
  const authenticationRequired =
    !isLoading &&
    (
      terminalError ||
      (!isError && !user)
    );

  const roleDenied =
    Boolean(
      user &&
      roles &&
      !roles.includes(user.role)
    );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    /*
     * Redirect only when the session
     * is genuinely invalid or missing.
     */
    if (authenticationRequired) {
      const next =
        encodeURIComponent(pathname);

      router.replace(
        `/login?next=${next}`
      );

      return;
    }

    /*
     * Keep role isolation in the UI.
     *
     * Backend authorization remains
     * the actual security boundary.
     */
    if (roleDenied && user) {
      router.replace(
        user.role === "SUPER_ADMIN"
          ? "/admin/dashboard"
          : "/dashboard"
      );
    }
  }, [
    authenticationRequired,
    isLoading,
    pathname,
    roleDenied,
    router,
    user,
  ]);

  if (isLoading) {
    return <LoadingWorkspace />;
  }

  /*
   * IMPORTANT:
   *
   * Do not redirect for:
   *
   * - Network failure
   * - API 500
   * - API 503
   * - Temporary database outage
   */
  if (isError && !terminalError) {
    const requestId =
      getApiErrorRequestId(error);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-amber-500/10">
            <AlertTriangle className="size-6 text-amber-500" />
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            Connection temporarily unavailable
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We couldn't verify your session
            right now. Your account has not
            been logged out.
          </p>

          {requestId && (
            <p className="mt-3 break-all text-xs text-muted-foreground">
              Reference:{" "}
              <span className="font-mono">
                {requestId}
              </span>
            </p>
          )}

          <Button
            className="mt-6"
            disabled={isFetching}
            onClick={() => {
              void refetch();
            }}
          >
            <RefreshCw
              className={
                isFetching
                  ? "size-4 animate-spin"
                  : "size-4"
              }
            />

            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (
    authenticationRequired ||
    !user ||
    roleDenied
  ) {
    return <LoadingWorkspace />;
  }

  return children;
}

function LoadingWorkspace() {
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