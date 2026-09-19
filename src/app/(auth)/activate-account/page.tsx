"use client";

import {
  Suspense,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Radio,
  ShieldCheck,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  activateAccountSchema,
  type ActivateAccountFormValues,
} from "@/lib/validations/activate-account";

import {
  useActivateAccount,
} from "@/hooks/auth/use-activate-account";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

function ActivateAccountContent() {
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get(
      "token"
    );

  const activateAccount =
    useActivateAccount();

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<ActivateAccountFormValues>({
      resolver:
        zodResolver(
          activateAccountSchema
        ),

      defaultValues: {
        password: "",
        confirmPassword:
          "",
      },
    });

  const submit = async (
    values:
      ActivateAccountFormValues
  ) => {
    if (!token) {
      toast.error(
        "This activation link is invalid."
      );

      return;
    }

    try {
      await activateAccount
        .mutateAsync({
          token,

          password:
            values.password,

          confirmPassword:
            values.confirmPassword,
        });

      toast.success(
        "Your ValYou account is ready"
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to activate your account"
        )
      );
    }
  };

  if (!token) {
    return (
      <InvalidActivationLink />
    );
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_.95fr]">
      {/* Brand / marketing side */}
      <div className="relative hidden overflow-hidden border-r border-border/60 lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
        <div className="pointer-events-none absolute -left-24 -top-24 size-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="pointer-events-none absolute bottom-0 right-0 size-[420px] rounded-full bg-violet-500/[0.07] blur-[130px]" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <Radio className="size-5" />
            </div>

            <div>
              <p className="font-semibold tracking-tight">
                ValYou
              </p>

              <p className="text-xs text-muted-foreground">
                Review intelligence
              </p>
            </div>
          </div>

          <div className="mt-20 max-w-xl">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Your workspace is
              ready
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.055em] xl:text-6xl">
              Turn every tap
              into better
              customer insight.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              Activate your
              account to access
              your review cards,
              business locations,
              subscription and
              customer engagement
              analytics.
            </p>
          </div>
        </div>

        <div className="relative grid gap-3 sm:grid-cols-2">
          <Feature
            icon={
              ShieldCheck
            }
            title="Secure access"
            description="Your password is created by you and never shared with ValYou."
          />

          <Feature
            icon={
              CheckCircle2
            }
            title="Workspace ready"
            description="Your business has already been prepared by the ValYou team."
          />
        </div>
      </div>

      {/* Form */}
      <div className="relative flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute right-0 top-0 size-72 rounded-full bg-emerald-500/[0.05] blur-[100px] lg:hidden" />

        <div className="relative w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Radio className="size-5" />
            </div>

            <div>
              <p className="font-semibold">
                ValYou
              </p>

              <p className="text-xs text-muted-foreground">
                Review intelligence
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10">
              <KeyRound className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
              Activate your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Create your password
              to finish setting up
              your ValYou
              account.
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit(
                submit
              )
            }
            className="space-y-5"
          >
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className="h-11 px-9"
                  {...register(
                    "password"
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
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
                    errors
                      .password
                      .message
                  }
                </p>
              )}
            </div>

            {/* Confirm */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Confirm password
              </Label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="h-11 px-9"
                  {...register(
                    "confirmPassword"
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
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

            <div className="rounded-xl border border-border/70 bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">
              Your activation link
              can only be used once.
              After activation,
              you will sign in with
              your email and this
              password.
            </div>

            <Button
              type="submit"
              className="h-11 w-full"
              disabled={
                activateAccount
                  .isPending
              }
            >
              {activateAccount
                .isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />

                  Activating...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />

                  Activate account
                </>
              )}
            </Button>
          </form>

          <p className="mt-7 text-center text-xs text-muted-foreground">
            ValYou accounts are
            created and managed by
            the ValYou team.
          </p>
        </div>
      </div>
    </div>
  );
}

function InvalidActivationLink() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10">
          <LockKeyhole className="size-6 text-red-500" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Invalid activation link
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This activation link is
          missing or invalid.
          Contact ValYou to
          request a new activation
          link.
        </p>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;

  title: string;

  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur">
      <Icon className="size-5 text-emerald-600 dark:text-emerald-400" />

      <p className="mt-4 text-sm font-medium">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default function ActivateAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ActivateAccountContent />
    </Suspense>
  );
}