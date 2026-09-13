"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useMe,
} from "@/hooks/auth/use-me";

export function GuestGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    data: user,
    isLoading,
  } = useMe();

  useEffect(() => {
    if (
      isLoading ||
      !user
    ) {
      return;
    }

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
  }, [
    user,
    isLoading,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" />
    );
  }

  if (user) {
    return null;
  }

  return children;
}