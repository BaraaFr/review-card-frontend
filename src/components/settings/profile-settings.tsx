"use client";

import { useEffect, useState } from "react";

import {
  Check,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Skeleton } from "@/components/ui/skeleton";

import { useProfile, useUpdateProfile } from "@/hooks/account/use-profile";
import { ChangePasswordForm } from "./change-password-form";

/*
 * =========================================================
 * Loading
 * =========================================================
 */

function ProfileLoading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />

          <Skeleton className="h-4 w-72" />
        </CardHeader>

        <CardContent className="space-y-5">
          <Skeleton className="h-10 w-full" />

          <Skeleton className="h-10 w-full" />

          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

/*
 * =========================================================
 * Component
 * =========================================================
 */

export function ProfileSettings() {
  const { data, isLoading, isError } = useProfile();

  const updateMutation = useUpdateProfile();

  const [name, setName] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [success, setSuccess] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  /*
   * =======================================================
   * Populate form
   * =======================================================
   */

  useEffect(() => {
    if (!data?.user) {
      return;
    }

    setName(data.user.name ?? "");

    setPhoneNumber(data.user.phoneNumber ?? "");
  }, [data]);

  /*
   * =======================================================
   * Loading
   * =======================================================
   */

  if (isLoading) {
    return <ProfileLoading />;
  }

  /*
   * =======================================================
   * Error
   * =======================================================
   */

  if (isError || !data?.user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-medium">We couldn't load your profile.</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Refresh the page and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const user = data.user;

  const normalizedName = name.trim();

  const normalizedPhone = phoneNumber.trim();

  const hasChanges =
    normalizedName !== user.name ||
    normalizedPhone !== (user.phoneNumber ?? "");

  const canSave =
    normalizedName.length >= 2 && hasChanges && !updateMutation.isPending;

  /*
   * =======================================================
   * Submit
   * =======================================================
   */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    setSuccess(false);

    try {
      await updateMutation.mutateAsync({
        name: normalizedName,

        phoneNumber: normalizedPhone || null,
      });

      setSuccess(true);

      window.setTimeout(() => {
        setSuccess(false);
      }, 2500);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };


  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (
    <div className="space-y-6">
      {/* =================================================
          Personal information
      ================================================= */}

      <Card
        className="
          overflow-hidden
          border-border/60
          shadow-sm
        "
      >
        <CardHeader
          className="
            border-b
            border-border/60
            bg-muted/10
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600

                dark:bg-emerald-950/30
                dark:text-emerald-400
              "
            >
              <UserRound className="size-5" />
            </div>

            <div>
              <CardTitle className="text-base">Personal Information</CardTitle>

              <CardDescription className="mt-1">
                Manage your personal account information.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ===========================================
                Name
            =========================================== */}

            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>

              <div className="relative">
                <UserRound
                  className="
                    absolute
                    left-3
                    top-1/2
                    size-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  id="profile-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);

                    setSuccess(false);
                  }}
                  placeholder="Your full name"
                  className="pl-9"
                  maxLength={100}
                />
              </div>

              {normalizedName.length > 0 && normalizedName.length < 2 && (
                <p className="text-xs text-destructive">
                  Name must contain at least 2 characters.
                </p>
              )}
            </div>

            {/* ===========================================
                Email
            =========================================== */}

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email address</Label>

              <div className="relative">
                <Mail
                  className="
                    absolute
                    left-3
                    top-1/2
                    size-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  id="profile-email"
                  type="email"
                  value={user.email}
                  disabled
                  readOnly
                  className="
                    pl-9
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Your email address cannot be changed from your profile.
              </p>
            </div>

            {/* ===========================================
                Phone
            =========================================== */}

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone number</Label>

              <div className="relative">
                <Phone
                  className="
                    absolute
                    left-3
                    top-1/2
                    size-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  id="profile-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);

                    setSuccess(false);
                  }}
                  placeholder="+961 ..."
                  className="pl-9"
                  maxLength={30}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Optional. Used for account and business communication.
              </p>
            </div>

            {/* ===========================================
                Error
            =========================================== */}

            {updateMutation.isError && (
              <div
                className="
                  rounded-lg
                  border
                  border-destructive/20
                  bg-destructive/5
                  px-4
                  py-3
                  text-sm
                  text-destructive
                "
              >
                We couldn't update your profile. Please check your information
                and try again.
              </div>
            )}

            {/* ===========================================
                Success
            =========================================== */}

            {success && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-emerald-200
                  bg-emerald-50
                  px-4
                  py-3
                  text-sm
                  text-emerald-700

                  dark:border-emerald-900/50
                  dark:bg-emerald-950/20
                  dark:text-emerald-400
                "
              >
                <Check className="size-4" />
                Profile updated successfully.
              </div>
            )}

            {/* ===========================================
                Save
            =========================================== */}

            <div
              className="
                flex
                justify-end
                border-t
                border-border/60
                pt-5
              "
            >
              <Button type="submit" disabled={!canSave}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* =================================================
          Security
      ================================================= */}

      <Card
        className="
          overflow-hidden
          border-border/60
          shadow-sm
        "
      >
        <CardHeader
          className="
            border-b
            border-border/60
            bg-muted/10
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-muted
                text-foreground
              "
            >
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <CardTitle className="text-base">Security</CardTitle>

              <CardDescription className="mt-1">
                Manage the security of your ValYou account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          {!changingPassword ? (
            <div
              className="
        flex
        flex-col
        gap-4

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
            >
              <div>
                <p className="text-sm font-medium">Password</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update the password used to sign in to your account.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setChangingPassword(true)}
              >
                Change password
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium">Change password</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your current password and choose a new secure password.
                </p>
              </div>

              <ChangePasswordForm onCancel={() => setChangingPassword(false)} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
