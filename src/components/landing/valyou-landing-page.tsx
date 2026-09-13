"use client";

import { useState } from "react";

import Image from "next/image";

import {
  ArrowRight,
  BarChart3,
  Building2,
  Mail,
  Menu,
  Radio,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  X,
} from "lucide-react";

import { AccountRequestForm } from "@/components/landing/account-request-form";

import { Badge } from "@/components/ui/badge";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import ValYouLogo from "./valyou-logo";
import { useMe } from "@/hooks/auth/use-me";
import { hasPossibleSession } from "@/lib/has-session";

const navigation = [
  {
    label: "Home",

    href: "#home",
  },

  {
    label: "How it works",

    href: "#how-it-works",
  },

  {
    label: "Features",

    href: "#features",
  },

  {
    label: "Our cards",

    href: "#cards",
  },

  {
    label: "Contact",

    href: "#contact",
  },
];

const features = [
  {
    icon: Radio,

    title: "Tap & Scan",

    description:
      "Give customers a frictionless way to reach your Google review page using NFC or QR.",
  },

  {
    icon: Star,

    title: "More Google Reviews",

    description:
      "Make it easier for satisfied customers to share their experience while it is still fresh.",
  },

  {
    icon: BarChart3,

    title: "Smart Analytics",

    description:
      "Understand card interactions, NFC versus QR usage and performance across your locations.",
  },

  {
    icon: Building2,

    title: "Multi-location Ready",

    description:
      "Manage multiple branches from one ValYou account with location-specific cards and reputation data.",
  },
];

const steps = [
  {
    number: "01",

    title: "Place your ValYou card",

    description:
      "Put the card where customers naturally finish their visit: reception, counter, checkout or table.",

    icon: Store,
  },

  {
    number: "02",

    title: "Customer taps or scans",

    description:
      "They tap with NFC or scan the QR code from their phone. No app installation is required.",

    icon: ScanLine,
  },

  {
    number: "03",

    title: "They reach Google",

    description:
      "ValYou records the interaction and sends them directly to the business's Google review page.",

    icon: Star,
  },
];

export function ValYouLandingPage({ isAuth }: { isAuth: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/*
       * ============================================
       * NAVBAR
       * ============================================
       */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center">
            <ValYouLogo />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block space-x-2">
            <a
              href="#request-account"
              className={cn(
                buttonVariants({
                  size: "default",
                }),

                "bg-emerald-600 text-white hover:bg-emerald-700"
              )}
            >
              Request an account
              <ArrowRight className="size-4" />
            </a>

            <a
              href={isAuth ? "/dashboard" : "/login"}
              className={cn(
                buttonVariants({
                  size: "default",
                }),

                "border-emerald-600 bg-white text-black hover:text-white  hover:bg-emerald-700"
              )}
            >
              {isAuth ? "Dashboard" : "Login"}
            </a>
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl border border-border lg:hidden"
            onClick={() => setMobileOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {item.label}
                </a>
              ))}

              <a
                href="#request-account"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  buttonVariants(),

                  "mt-2 bg-emerald-600 text-white hover:bg-emerald-700"
                )}
              >
                Request an account
              </a>

              <a
                href={isAuth ? "/dashboard" : "/login"}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  buttonVariants(),

                  "mt-2 border-emerald-600 bg-white hover:text-white text-black hover:bg-emerald-700"
                )}
              >
                {isAuth ? "Dashboard" : "Login"}
              </a>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/*
         * ============================================
         * HERO
         * ============================================
         */}
        <section id="home" className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.12),transparent_32%),radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_28%)]" />

          <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
            <div>
              <Badge
                variant="secondary"
                className="gap-2 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-400"
              >
                <Sparkles className="size-3.5" />
                More reviews. Better visibility.
              </Badge>

              <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Turn every customer visit into an easier{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  Google review.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                ValYou combines premium NFC and QR review cards with a simple
                analytics platform, helping restaurants, cafés, shops, clinics,
                salons and other businesses make reviewing them effortless.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#request-account"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                    }),

                    "bg-emerald-600 text-white shadow-lg shadow-emerald-500/15 hover:bg-emerald-700"
                  )}
                >
                  Request an account
                  <ArrowRight className="size-4" />
                </a>

                <a
                  href="#contact"
                  className={cn(
                    buttonVariants({
                      variant: "outline",

                      size: "lg",
                    })
                  )}
                >
                  Contact us
                </a>
              </div>

              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
                <TrustPoint icon={Radio} text="NFC + QR" />

                <TrustPoint icon={BarChart3} text="Interaction analytics" />

                <TrustPoint icon={ShieldCheck} text="Simple & secure" />
              </div>
            </div>

            {/*
             * Hero card
             */}
            <div className="relative mx-auto flex w-full max-w-lg items-center justify-center py-8 lg:py-0">
              <div className="absolute left-5 top-16 size-48 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="absolute bottom-10 right-4 size-56 rounded-full bg-emerald-500/15 blur-3xl" />

              <div className="absolute z-50 right-2 top-6 rounded-2xl border border-border/60 bg-background/90 p-4 shadow-xl backdrop-blur sm:right-0">
                <div className="flex items-center gap-2">
                  <Radio className="size-5 text-emerald-600" />

                  <span className="text-sm font-semibold">
                    Just tap or scan
                  </span>
                </div>
              </div>

              <div className="relative mt-10 transition-transform duration-500 hover:-translate-y-2 hover:rotate-[-1deg]">
                <div className="absolute inset-x-8 bottom-0 h-16 rounded-full bg-black/20 blur-2xl" />

                <Image
                  src="/images/valyou-card-hero.png"
                  alt="ValYou NFC and QR Google review card"
                  width={440}
                  height={688}
                  priority
                  className="relative h-auto w-[260px] rounded-2xl object-cover shadow-2xl sm:w-[320px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/*
         * ============================================
         * FEATURES
         * ============================================
         */}
        <section
          id="features"
          className="border-y border-border/60 bg-muted/20"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why ValYou"
              title="Everything you need to make reviewing easier"
              description="A physical product customers immediately understand, backed by software that gives business owners useful visibility."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="group rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Icon className="size-5" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/*
         * ============================================
         * HOW IT WORKS
         * ============================================
         */}
        <section id="how-it-works">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="How it works"
              title="More reviews in three simple steps"
              description="The experience is intentionally simple for both the business and the customer."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-7"
                  >
                    <span className="absolute right-5 top-2 text-7xl font-bold tracking-tighter text-muted/50">
                      {step.number}
                    </span>

                    <div className="relative">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Icon className="size-5" />
                      </div>

                      <h3 className="mt-8 text-xl font-semibold">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/*
         * ============================================
         * CARD SHOWCASE
         * ============================================
         */}
        <section
          id="cards"
          className="overflow-hidden bg-slate-950 text-white dark:bg-black"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Our product
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Cards designed to be noticed.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  ValYou cards combine NFC and QR in a clear, eye-catching
                  format that customers understand immediately. Place them at
                  the counter, reception or checkout area and keep the
                  experience simple.
                </p>

                <div className="mt-7 space-y-3">
                  <ProductPoint text="NFC tap + QR scan" />

                  <ProductPoint text="Permanent ValYou redirect link" />

                  <ProductPoint text="Location-level tracking" />

                  <ProductPoint text="Designed for counters, tables and reception areas" />
                </div>

                <a
                  href="#request-account"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                    }),

                    "mt-8 bg-emerald-500 text-white hover:bg-emerald-600"
                  )}
                >
                  Request ValYou cards
                  <ArrowRight className="size-4" />
                </a>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <CardShowcase title="Front view" className="sm:translate-y-6">
                  <Image
                    src="/images/valyou-card-front.png"
                    alt="ValYou review card front"
                    width={300}
                    height={470}
                    className="mx-auto w-44 rounded-xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:-rotate-2"
                  />
                </CardShowcase>

                <CardShowcase title="Stack view">
                  <div className="relative mx-auto h-[290px] w-44">
                    <Image
                      src="/images/valyou-card-stack.png"
                      alt=""
                      width={300}
                      height={470}
                      className="absolute left-3 top-5 w-40 rotate-6 rounded-xl opacity-50"
                    />

                    <Image
                      src="/images/valyou-card-stack.png"
                      alt=""
                      width={300}
                      height={470}
                      className="absolute left-1 top-3 w-40 rotate-3 rounded-xl opacity-75"
                    />

                    <Image
                      src="/images/valyou-card-stack.png"
                      alt="Stack of ValYou review cards"
                      width={300}
                      height={470}
                      className="absolute left-0 top-0 w-40 rounded-xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-2"
                    />
                  </div>
                </CardShowcase>

                <CardShowcase
                  title="In your business"
                  className="sm:translate-y-10"
                >
                  {/* <div className="flex min-h-[310px] items-end justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-slate-200 p-2"> */}
                  <Image
                    src="/images/valyou-card-business.png"
                    alt="ValYou review card placed in a business"
                    width={300}
                    height={800}
                    className="w-40 rounded-xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-2"
                  />
                  {/* </div> */}
                </CardShowcase>
              </div>
            </div>
          </div>
        </section>

        {/*
         * ============================================
         * REQUEST ACCOUNT
         * ============================================
         */}
        <section id="request-account">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[.7fr_1.3fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Request an account
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Get your ValYou cards today.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                Tell us about your business, how many cards you need and the
                best number to reach you on. The ValYou team will contact you
                and handle the rest.
              </p>

              <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-sm font-medium">What happens next?</p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We review your request, contact you, configure your business
                  and locations, prepare your cards and then send your ValYou
                  account activation link.
                </p>
              </div>
            </div>

            <AccountRequestForm />
          </div>
        </section>

        {/*
         * ============================================
         * CONTACT
         * ============================================
         */}
        <section id="contact" className="border-y border-border/60 bg-muted/20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[.7fr_1.3fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Contact us
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Let&apos;s grow together.
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                Have a question before requesting an account? Our team is happy
                to help.
              </p>
            </div>

            <a
              href="mailto:info@valyou.com"
              className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 transition duration-300 hover:border-emerald-500/30 hover:shadow-lg"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Mail className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>

                <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  info@valyou.com
                </p>
              </div>
            </a>
          </div>
        </section>
      </main>

      {/*
       * ============================================
       * FOOTER
       * ============================================
       */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <ValYouLogo />

            <p className="mt-2 text-xs text-muted-foreground">
              More reviews. Better visibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ValYou. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;

  title: string;

  description: string;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-end">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          {eyebrow}
        </p>

        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          {title}
        </h2>
      </div>

      <p className="max-w-xl text-sm leading-7 text-muted-foreground lg:justify-self-end">
        {description}
      </p>
    </div>
  );
}

function TrustPoint({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;

  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />

      {text}
    </div>
  );
}

function ProductPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/15">
        <div className="size-2 rounded-full bg-emerald-400" />
      </div>

      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}

function CardShowcase({
  title,
  children,
  className,
}: {
  title: string;

  children: React.ReactNode;

  className?: string;
}) {
  return (
    <div
      className={cn(
        "group rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur transition duration-300 hover:border-emerald-400/30 hover:bg-white/[0.07]",

        className
      )}
    >
      <div className="flex min-h-[320px] items-center justify-center">
        {children}
      </div>

      <p className="mt-3 text-center text-xs font-medium text-slate-400">
        {title}
      </p>
    </div>
  );
}
