"use client";

import {
  Suspense,
  useState,
} from "react";

import Link from "next/link";

import {
  useSearchParams,
} from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import axios from "axios";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  TriangleAlert,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  AuthShell,
} from "@/components/auth/auth-shell";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";

import {
  useResetPassword,
} from "@/hooks/auth/use-reset-password";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

type PasswordResetApiError = {
  success?:
    boolean;

  code?:
    string;

  message?:
    string;
};

function ResetPasswordContent() {
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get(
      "token"
    );

  const resetPassword =
    useResetPassword();

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(
      false
    );

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(
      false
    );

  const [
    success,
    setSuccess,
  ] =
    useState(
      false
    );

  const [
    invalidToken,
    setInvalidToken,
  ] =
    useState(
      false
    );

  const {
    register,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<ResetPasswordFormValues>({
      resolver:
        zodResolver(
          resetPasswordSchema
        ),

      defaultValues: {
        password:
          "",

        confirmPassword:
          "",
      },
    });

  /*
   * =======================================================
   * Missing/invalid token
   * =======================================================
   */

  if (
    !token ||
    invalidToken
  ) {
    return (
      <AuthShell
        title="Reset link unavailable"
        description="This password reset link is invalid or has expired."
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10">
              <TriangleAlert className="size-5 text-amber-400" />
            </div>

            <p className="mt-5 text-sm font-medium">
              Request a new reset link
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              For your security, password reset
              links can only be used once and
              expire after 30 minutes.
            </p>
          </div>

          <Link
            href="/forgot-password"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
          >
            Request new link

            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />

            Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  /*
   * =======================================================
   * Successful reset
   * =======================================================
   */

  if (
    success
  ) {
    return (
      <AuthShell
        title="Password updated"
        description="Your ValYou password has been reset successfully."
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="size-5 text-emerald-400" />
            </div>

            <p className="mt-5 text-sm font-medium">
              You&apos;re all set
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your old sessions have been
              signed out. Sign in again using
              your new password.
            </p>
          </div>

          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
          >
            Sign in

            <ArrowRight className="size-4" />
          </Link>
        </div>
      </AuthShell>
    );
  }

  const submit =
    async (
      values:
        ResetPasswordFormValues
    ) => {
      try {
        await resetPassword
          .mutateAsync({
            token,

            password:
              values.password,

            confirmPassword:
              values.confirmPassword,
          });

        setSuccess(
          true
        );
      } catch (
        error
      ) {
        if (
          axios.isAxiosError<PasswordResetApiError>(
            error
          ) &&
          error.response
            ?.data
            ?.code ===
            "INVALID_OR_EXPIRED_PASSWORD_RESET"
        ) {
          setInvalidToken(
            true
          );

          return;
        }

        toast.error(
          getApiErrorMessage(
            error,
            "Unable to reset your password"
          )
        );
      }
    };

  /*
   * =======================================================
   * Reset form
   * =======================================================
   */

  return (
    <AuthShell
      title="Create a new password"
      description="Choose a secure new password for your ValYou account."
    >
      <form
        onSubmit={
          handleSubmit(
            submit
          )
        }
        className="space-y-5"
      >
        <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
          <KeyRound className="size-5 text-emerald-400" />
        </div>

        {/* Password */}

        <div className="space-y-2">
          <Label htmlFor="password">
            New password
          </Label>

          <div className="relative">
            <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              className="h-12 px-10"
              {...register(
                "password"
              )}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (
                    value
                  ) =>
                    !value
                )
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-destructive">
              {
                errors.password
                  .message
              }
            </p>
          )}
        </div>

        {/* Confirm */}

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm password
          </Label>

          <div className="relative">
            <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="Repeat your password"
              className="h-12 px-10"
              {...register(
                "confirmPassword"
              )}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (
                    value
                  ) =>
                    !value
                )
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors
            .confirmPassword && (
            <p className="text-xs text-destructive">
              {
                errors
                  .confirmPassword
                  .message
              }
            </p>
          )}
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">
          Your reset link expires after 30
          minutes and can only be used once.
          Resetting your password signs out
          your existing ValYou sessions.
        </div>

        <Button
          type="submit"
          disabled={
            resetPassword
              .isPending
          }
          className="h-12 w-full rounded-xl bg-emerald-400 font-semibold text-zinc-950 hover:bg-emerald-300"
        >
          {resetPassword
            .isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />

              Updating password...
            </>
          ) : (
            <>
              Reset password

              <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />

          Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}