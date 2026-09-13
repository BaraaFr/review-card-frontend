"use client";

import {
  useState,
} from "react";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  z,
} from "zod";

import {
  toast,
} from "sonner";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  useCreateAccountRequest,
} from "@/hooks/account-requests/use-create-account-request";

const formSchema =
  z.object({
    ownerName:
      z
        .string()
        .trim()
        .min(
          2,
          "Enter your name."
        ),

    phone:
      z
        .string()
        .trim()
        .min(
          7,
          "Enter your phone number."
        ),

    shopName:
      z
        .string()
        .trim()
        .min(
          2,
          "Enter your business name."
        ),

    businessType:
      z
        .string()
        .min(
          1,
          "Select your business type."
        ),

    requestedCards:
      z.coerce
        .number()
        .int()
        .min(
          1,
          "Enter the number of cards."
        )
        .max(
          500
        ),

    message:
      z
        .string()
        .max(
          1000
        )
        .optional(),

    website:
      z
        .string()
        .optional(),
  });

type FormValues =
  z.infer<
    typeof formSchema
  >;

export function AccountRequestForm() {
  const mutation =
    useCreateAccountRequest();

  const [
    submitted,
    setSubmitted,
  ] =
    useState(false);

  const form =
    useForm<FormValues>({
      resolver:
        zodResolver(
          formSchema
        ),

      defaultValues: {
        ownerName:
          "",

        phone:
          "",

        shopName:
          "",

        businessType:
          "",

        requestedCards:
          2,

        message:
          "",

        website:
          "",
      },
    });

  async function onSubmit(
    values:
      FormValues
  ) {
    try {
      const result =
        await mutation.mutateAsync({
          ownerName:
            values.ownerName,

          phone:
            values.phone,

          shopName:
            values.shopName,

          businessType:
            values.businessType,

          requestedCards:
            Number(
              values.requestedCards
            ),

          message:
            values.message ||
            null,

          website:
            values.website,
        });

      toast.success(
        result.message
      );

      setSubmitted(
        true
      );

      form.reset();
    } catch (
      error
    ) {
      toast.error(
        error instanceof
          Error
          ? error.message
          : "Unable to submit your request."
      );
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[390px] flex-col items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h3 className="mt-5 text-2xl font-semibold tracking-tight">
          Request received
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Thanks for your
          interest in ValYou.
          Our team will review
          your business request
          and contact you using
          the phone number you
          provided.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() =>
            setSubmitted(
              false
            )
          }
        >
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        form.handleSubmit(
          onSubmit
        )
      }
      className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7"
    >
      {/*
       * Honeypot.
       */}
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        <label>
          Website

          <input
            type="text"
            tabIndex={
              -1
            }
            autoComplete="off"
            {...form.register(
              "website"
            )}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Owner name"
          required
          error={
            form.formState
              .errors
              .ownerName
              ?.message
          }
        >
          <Input
            placeholder="Your name"
            autoComplete="name"
            {...form.register(
              "ownerName"
            )}
          />
        </Field>

        <Field
          label="Business name"
          required
          error={
            form.formState
              .errors
              .shopName
              ?.message
          }
        >
          <Input
            placeholder="Your shop name"
            {...form.register(
              "shopName"
            )}
          />
        </Field>

        <Field
          label="Phone number"
          required
          error={
            form.formState
              .errors
              .phone
              ?.message
          }
        >
          <Input
            type="tel"
            placeholder="+961 ..."
            autoComplete="tel"
            {...form.register(
              "phone"
            )}
          />
        </Field>

        <Field
          label="Number of cards"
          required
          error={
            form.formState
              .errors
              .requestedCards
              ?.message
          }
        >
          <Input
            type="number"
            min={
              1
            }
            max={
              500
            }
            {...form.register(
              "requestedCards",
              {
                valueAsNumber:
                  true,
              }
            )}
          />
        </Field>

        <Field
          label="Business type"
          required
          error={
            form.formState
              .errors
              .businessType
              ?.message
          }
        >
          <select
            {...form.register(
              "businessType"
            )}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            <option value="">
              Select business type
            </option>

            <option value="Restaurant">
              Restaurant
            </option>

            <option value="Cafe">
              Café
            </option>

            <option value="Retail">
              Retail shop
            </option>

            <option value="Salon">
              Salon / Barbershop
            </option>

            <option value="Healthcare">
              Clinic / Healthcare
            </option>

            <option value="Hospitality">
              Hotel / Hospitality
            </option>

            <option value="Services">
              Services
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Message"
            error={
              form.formState
                .errors
                .message
                ?.message
            }
          >
            <Textarea
              placeholder="Tell us a little about your business or what you need..."
              rows={
                4
              }
              {...form.register(
                "message"
              )}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-muted-foreground">
          This does not create
          an account immediately.
          The ValYou team will
          review your request and
          contact you to complete
          onboarding.
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={
            mutation.isPending
          }
          className="w-full shrink-0 sm:w-auto"
        >
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}

          {mutation.isPending
            ? "Sending..."
            : "Submit request"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;

  required?: boolean;

  error?:
    | string;

  children:
    React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}

        {required && (
          <span className="ml-1 text-destructive">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}