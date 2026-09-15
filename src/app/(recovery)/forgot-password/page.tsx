"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
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
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";

import {
  useForgotPassword,
} from "@/hooks/auth/use-forgot-password";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

export default function ForgotPasswordPage() {
  const forgotPassword =
    useForgotPassword();

  const [
    submittedEmail,
    setSubmittedEmail,
  ] =
    useState<
      string |
      null
    >(
      null
    );

  const {
    register,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<ForgotPasswordFormValues>({
      resolver:
        zodResolver(
          forgotPasswordSchema
        ),

      defaultValues: {
        email:
          "",
      },
    });

  const submit =
    async (
      values:
        ForgotPasswordFormValues
    ) => {
      try {
        await forgotPassword
          .mutateAsync({
            email:
              values.email,
          });

        setSubmittedEmail(
          values.email
        );
      } catch (
        error
      ) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to send password reset instructions"
          )
        );
      }
    };

  /*
   * =======================================================
   * Success state
   * =======================================================
   */

  if (
    submittedEmail
  ) {
    return (
      <AuthShell
        title="Check your email"
        description="We've processed your password reset request."
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="size-5 text-emerald-400" />
            </div>

            <p className="mt-5 text-sm font-medium text-foreground">
              Password reset instructions
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              If an account exists for{" "}
              <span className="font-medium text-foreground">
                {submittedEmail}
              </span>
              , we&apos;ve sent a password reset link.
            </p>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              The link expires in 30 minutes.
              Check your spam or junk folder if
              you don&apos;t see the email.
            </p>
          </div>

          <Button 
            type="button"
            className="h-11 w-full"
            onClick={() =>
              setSubmittedEmail(
                null
              )
            }
          >
            Try another email
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
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
   * Form
   * =======================================================
   */

  return (
    <AuthShell
      title="Forgot password?"
      description="Enter the email linked to your ValYou account and we'll send you password reset instructions."
    >
      <form
        onSubmit={
          handleSubmit(
            submit
          )
        }
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-zinc-300"
          >
            Email address
          </Label>

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

            <Input
              id="email"
              type="email"
              placeholder="you@business.com"
              autoComplete="email"
              className="
                h-12
                border-border/70
                bg-background/60
                pl-10
                text-foreground
                placeholder:text-muted-foreground
                focus-visible:border-emerald-500/50
                focus-visible:ring-emerald-500/20
              "
              {...register(
                "email"
              )}
            />
          </div>

          {errors.email && (
            <p className="text-xs text-red-400">
              {
                errors.email
                  .message
              }
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={
            forgotPassword
              .isPending
          }
          className="h-12 w-full rounded-xl bg-emerald-400 font-semibold text-zinc-950 hover:bg-emerald-300"
        >
          {forgotPassword
            .isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />

              Sending...
            </>
          ) : (
            <>
              Send reset link

              <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />

          Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}