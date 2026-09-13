"use client";

import {
  Settings2,
} from "lucide-react";
import { ProfileSettings } from "@/components/settings/profile-settings";

export default function ProfilePage() {

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-10">
      {/* ===============================================
          Page header
      =============================================== */}

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50/70 via-background to-background px-5 py-6 dark:from-emerald-950/25 sm:px-7 sm:py-7">
          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10" />

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200/70 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Settings2 className="size-5" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Profile
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Manage your ValYou account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileSettings />
    </div>
  );
}
