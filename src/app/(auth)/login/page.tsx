"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowRight, Loader2, LockKeyhole, Mail } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

import { useLogin } from "@/hooks/auth/use-login";

import { getApiErrorMessage } from "@/lib/api-error";

import { toast } from "sonner";

export default function LoginPage() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to sign in"));
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to manage your review cards, locations and customer engagement."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300">
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
              {...register("email")}
            />
          </div>

          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-300">
            Password
          </Label>

          <div className="relative">
            <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
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
              {...register("password")}
            />
          </div>

          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-12 w-full rounded-xl bg-emerald-400 font-semibold text-zinc-950 hover:bg-emerald-300"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>

        <div className="mt-7 text-center">
          <p className="text-sm text-muted-foreground">
            ValYou accounts are invitation-only.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Contact ValYou if your business needs access.
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
