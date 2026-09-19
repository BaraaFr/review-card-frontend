"use client";

import { useState } from "react";

import Image from "next/image";

import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Crown,
  Mail,
  Menu,
  MessageCircle,
  Radio,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Zap,
  X,
} from "lucide-react";

import { AccountRequestForm } from "@/components/landing/account-request-form";

import { Badge } from "@/components/ui/badge";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import ValYouLogo from "./valyou-logo";
import InstagramIcon from "./instagram-icon";
import Link from "next/link";

/*
 * =========================================================
 * Navigation
 * =========================================================
 */

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
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

/*
 * =========================================================
 * Features
 * =========================================================
 */

const features = [
  {
    icon: Radio,

    title: "Tap & Scan",

    description:
      "Give customers a frictionless way to reach your Google review page with NFC or QR.",
  },

  {
    icon: Star,

    title: "More Google Reviews",

    description:
      "Make it easier for happy customers to share their experience while the visit is still fresh.",
  },

  {
    icon: BarChart3,

    title: "Smart Analytics",

    description:
      "See how customers interact with your cards, locations and review experience.",
  },

  {
    icon: Building2,

    title: "Multi-location Ready",

    description:
      "Manage different branches, locations and review cards from one ValYou workspace.",
  },
];

/*
 * =========================================================
 * Steps
 * =========================================================
 */

const steps = [
  {
    number: "01",

    title: "Place your ValYou card",

    description:
      "Put it where the customer naturally finishes the experience — at the counter, reception, checkout or table.",

    icon: Store,
  },

  {
    number: "02",

    title: "Customer taps or scans",

    description:
      "They use NFC or QR directly from their phone. No app, account or complicated instructions required.",

    icon: ScanLine,
  },

  {
    number: "03",

    title: "They reach your Google reviews",

    description:
      "ValYou records the interaction and takes the customer directly to your Google review page.",

    icon: Star,
  },
];

/*
 * =========================================================
 * Pricing
 * =========================================================
 */

const pricingPlans = [
  {
    name: "Starter",
    price: "4.5",

    icon: Zap,

    featured: false,

    description:
      "A simple starting point for small businesses that want to collect more Google reviews.",

    features: [
      "1 business location",
      "Up to 2 active review cards",
      "NFC tap experience",
      "Dynamic QR experience",
      "Interaction analytics",
    ],
  },

  {
    name: "Pro",
    price: "8",

    icon: Sparkles,

    featured: true,

    badge: "Recommended",

    description:
      "More capacity for growing businesses with multiple locations and review touchpoints.",

    features: [
      "Up to 3 business locations",
      "Up to 10 active review cards",
      "NFC tap experience",
      "Dynamic QR experience",
      "Interaction analytics",
    ],
  },

  {
    /*
     * Public marketing name: Premium
     * Backend plan: BUSINESS
     */
    name: "Premium",
    price: "12",

    icon: Crown,

    featured: false,

    description:
      "Our highest-capacity plan for businesses with several locations and more review cards.",

    features: [
      "Up to 10 business locations",
      "Up to 50 active review cards",
      "NFC tap experience",
      "Dynamic QR experience",
      "Interaction analytics",
    ],
  },
];

/*
 * =========================================================
 * Page
 * =========================================================
 */

export function ValYouLandingPage({ isAuth }: { isAuth: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* =================================================
          Navbar
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <ValYouLogo />
          </Link>

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

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="#request-account"
              className={cn(
                buttonVariants({
                  size: "default",
                }),

                "bg-emerald-600 text-white shadow-sm shadow-emerald-500/10 hover:bg-emerald-700"
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

                  variant: "outline",
                }),

                "border-emerald-600/40"
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
                <ArrowRight className="size-4" />
              </a>

              <a
                href={isAuth ? "/dashboard" : "/login"}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),

                  "mt-2"
                )}
              >
                {isAuth ? "Dashboard" : "Login"}
              </a>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* =================================================
            Hero
        ================================================= */}

        <section id="home" className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_15%_35%,rgba(59,130,246,0.07),transparent_28%)]" />

          <div className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
            {/* Hero copy */}

            <div>
              <Badge
                variant="secondary"
                className="gap-2 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-400"
              >
                <Sparkles className="size-3.5" />
                More reviews. Better visibility.
              </Badge>

              <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Your happy customers are already there.
                <span className="block text-emerald-600 dark:text-emerald-400">
                  Make reviewing you effortless.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                ValYou combines NFC and QR review cards with a simple analytics
                platform, helping your business turn great customer experiences
                into more Google reviews.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#request-account"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                    }),

                    "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                  )}
                >
                  Request your account
                  <ArrowRight className="size-4" />
                </a>

                <a
                  href="#pricing"
                  className={cn(
                    buttonVariants({
                      size: "lg",

                      variant: "outline",
                    })
                  )}
                >
                  View pricing
                </a>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Request first. Our team handles the setup with you.
              </p>

              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
                <TrustPoint icon={Radio} text="NFC + QR" />

                <TrustPoint icon={BarChart3} text="Interaction analytics" />

                <TrustPoint icon={ShieldCheck} text="No app required" />
              </div>
            </div>

            {/* Hero product */}

            <div className="relative mx-auto flex w-full max-w-lg items-center justify-center py-8 lg:py-0">
              <div className="absolute left-5 top-16 size-48 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="absolute bottom-10 right-4 size-56 rounded-full bg-emerald-500/15 blur-3xl" />

              <div className="absolute right-1 top-6 z-20 rounded-2xl border border-border/60 bg-background/90 p-4 shadow-xl backdrop-blur sm:right-0">
                <div className="flex items-center gap-2">
                  <Radio className="size-5 text-emerald-600" />

                  <span className="text-sm font-semibold">
                    Just tap or scan
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Straight to Google reviews
                </p>
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

        {/* =================================================
            Features
        ================================================= */}

        <section
          id="features"
          className="border-y border-border/60 bg-muted/20"
        >
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why ValYou"
              title="Make it easier to earn the reviews your business deserves"
              description="ValYou connects a physical customer touchpoint with a digital dashboard, giving you a simpler review experience and useful performance visibility."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="group rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white dark:text-emerald-400">
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

        {/* =================================================
            How it works
        ================================================= */}

        <section id="how-it-works" className="relative">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="How it works"
              title="From customer visit to Google review in three simple steps"
              description="The experience is intentionally simple. Your customer should understand what to do without needing an explanation."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-7 shadow-sm"
                  >
                    <span className="absolute right-5 top-1 text-7xl font-bold tracking-tighter text-muted/60">
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

            <div className="mt-10 flex justify-center">
              <a
                href="#request-account"
                className={cn(
                  buttonVariants({
                    size: "lg",

                    variant: "outline",
                  }),

                  "border-emerald-500/30"
                )}
              >
                Start with ValYou
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        {/* =================================================
            Card showcase
        ================================================= */}

        <section
          id="cards"
          className="overflow-hidden bg-slate-950 text-white dark:bg-black"
        >
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <Badge className="border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
                  The physical experience
                </Badge>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  Designed to be noticed.
                  <span className="block text-emerald-400">
                    Built to be effortless.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Put ValYou exactly where the customer is most likely to act.
                  One tap or scan takes them directly to your Google review
                  experience.
                </p>

                <div className="mt-8 space-y-3">
                  <ProductPoint text="NFC tap + QR scan" />

                  <ProductPoint text="Permanent ValYou card link" />

                  <ProductPoint text="Location-level performance tracking" />

                  <ProductPoint text="Ideal for counters, tables and reception areas" />
                </div>

                <a
                  href="#request-account"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                    }),

                    "mt-8 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
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
                  <Image
                    src="/images/valyou-card-business.png"
                    alt="ValYou review card inside a business"
                    width={300}
                    height={800}
                    className="w-40 rounded-xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-2"
                  />
                </CardShowcase>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            Pricing
        ================================================= */}

        <section
          id="pricing"
          className="relative overflow-hidden border-b border-border/60"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_42%)]" />

          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                variant="secondary"
                className="gap-2 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-400"
              >
                <Sparkles className="size-3.5" />
                Simple monthly pricing
              </Badge>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                A small monthly investment.
                <span className="block text-emerald-600 dark:text-emerald-400">
                  A stronger online reputation.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Choose the plan that fits your business today. Our team helps
                you get everything configured correctly before you start.
              </p>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.name} {...plan} />
              ))}
            </div>

            <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04] px-6 py-7 text-center">
              <p className="text-base font-semibold">
                Not sure which plan fits your business?
              </p>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Request an account and our team will help you choose the setup
                that makes sense for your business.
              </p>

              <a
                href="#request-account"
                className={cn(
                  buttonVariants({
                    size: "lg",
                  }),

                  "mt-5 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                )}
              >
                Request your ValYou account
                <ArrowRight className="size-4" />
              </a>

              <p className="mt-3 text-xs text-muted-foreground">
                No instant checkout. Talk to the ValYou team first.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            Request Account
        ================================================= */}

        <section id="request-account" className="relative overflow-hidden">
          <div className="absolute -left-28 bottom-0 -z-10 size-72 rounded-full bg-emerald-500/5 blur-3xl" />

          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Request an account
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Ready to turn more customers into{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  Google reviews?
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                Tell us a little about your business. You&apos;re not committing
                to a purchase — our team will contact you, recommend the right
                setup and handle onboarding with you.
              </p>

              <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.05] p-6">
                <p className="text-sm font-semibold">
                  Getting started is simple
                </p>

                <div className="mt-5 space-y-4">
                  <RequestStep
                    number="1"
                    text="Send us your business details"
                  />

                  <RequestStep
                    number="2"
                    text="Our team contacts you and recommends the right setup"
                  />

                  <RequestStep
                    number="3"
                    text="We prepare your account, locations and ValYou cards"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

                <p className="text-xs leading-5 text-muted-foreground">
                  Your account is created by the ValYou team, so your setup is
                  ready before you begin.
                </p>
              </div>
            </div>

            <AccountRequestForm />
          </div>
        </section>

        {/* =================================================
            Contact
        ================================================= */}

        <section id="contact" className="border-y border-border/60 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                  Talk to ValYou
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Have a question?
                  <span className="block text-emerald-600 dark:text-emerald-400">
                    We&apos;re one message away.
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                  Whether you&apos;re ready to start or simply want to
                  understand how ValYou can work for your business, reach out
                  directly.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* WhatsApp */}

                <a
                  href="https://wa.me/96181603557?text=Hi%20ValYou%2C%20I%27m%20interested%20in%20ValYou%20for%20my%20business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-emerald-600 p-6 text-white shadow-lg shadow-emerald-500/10 transition duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl"
                >
                  <div className="absolute -right-8 -top-8 size-28 rounded-full bg-white/10 blur-2xl" />

                  <div className="relative">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
                      <MessageCircle className="size-5" />
                    </div>

                    <p className="mt-5 text-sm text-emerald-100">
                      Fastest way to reach us
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      Chat on WhatsApp
                    </p>

                    <p className="mt-1 text-sm text-emerald-100">
                      +961 81 603 557
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm font-medium">
                      Start a conversation
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>

                {/* Secondary contact methods */}

                <div className="grid gap-4">
                  <a
                    href="https://www.instagram.com/valyou_lb/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lg"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/10 via-pink-500/10 to-orange-500/10 text-pink-600 dark:text-pink-400">
                    <InstagramIcon className="size-5 text-pink-600 dark:text-pink-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Instagram</p>

                      <p className="mt-1 font-semibold">@valyou_lb</p>
                    </div>

                    <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </a>

                  <a
                    href="mailto:info.valyou.lb@gmail.com"
                    className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lg"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Mail className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>

                      <p className="mt-1 truncate font-semibold">
                        info.valyou.lb@gmail.com
                      </p>
                    </div>

                    <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            Final CTA
        ================================================= */}

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_40%)]" />

          <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Star className="size-6" />
            </div>

            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
              Make the next happy customer
              <span className="block text-emerald-600 dark:text-emerald-400">
                easier to hear from.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Give customers a simple moment to share their experience and give
              your business better visibility into every interaction.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#request-account"
                className={cn(
                  buttonVariants({
                    size: "lg",
                  }),

                  "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                )}
              >
                Request an account
                <ArrowRight className="size-4" />
              </a>

              <a
                href="https://wa.me/96181603557?text=Hi%20ValYou%2C%20I%27m%20interested%20in%20ValYou%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({
                    size: "lg",

                    variant: "outline",
                  })
                )}
              >
                <MessageCircle className="size-4" />
                Talk to us
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================
          Footer
      ================================================= */}

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1fr_auto_auto] md:items-start">
            <div>
              <ValYouLogo />

              <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
                More reviews. Better visibility. A simpler review experience for
                modern businesses.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Explore
              </p>

              <div className="mt-4 grid gap-3">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Connect
              </p>

              <div className="mt-4 grid gap-3">
                <a
                  href="https://www.instagram.com/valyou_lb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-emerald-600"
                >
                 <InstagramIcon className="size-4 text-muted-foreground" />
                  @valyou_lb
                </a>

                <a
                  href="https://wa.me/96181603557"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-emerald-600"
                >
                  <MessageCircle className="size-4" />
                  +961 81 603 557
                </a>

                <a
                  href="mailto:info.valyou.lb@gmail.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-emerald-600"
                >
                  <Mail className="size-4" />
                  info.valyou.lb@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ValYou. All rights reserved.
            </p>

            <p className="text-xs text-muted-foreground">
              NFC + QR review technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/*
 * =========================================================
 * Section Heading
 * =========================================================
 */

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

/*
 * =========================================================
 * Trust Point
 * =========================================================
 */

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
      <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10">
        <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
      </div>

      {text}
    </div>
  );
}

/*
 * =========================================================
 * Product Point
 * =========================================================
 */

function ProductPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
        <Check className="size-3.5 text-emerald-400" />
      </div>

      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}

/*
 * =========================================================
 * Card Showcase
 * =========================================================
 */

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

/*
 * =========================================================
 * Pricing Card
 * =========================================================
 */

function PricingCard({
  name,
  price,
  description,
  features,
  featured,
  badge,
  icon: Icon,
}: {
  name: string;

  price: string;

  description: string;

  features: string[];

  featured: boolean;

  badge?: string;

  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-6 transition duration-300 sm:p-7",

        featured
          ? "border-emerald-500/50 shadow-xl shadow-emerald-500/10 lg:-translate-y-3"
          : "border-border/70 shadow-sm hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg"
      )}
    >
      {featured && (
        <>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-600" />

          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-emerald-500/10 blur-3xl" />
        </>
      )}

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl",

              featured
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            )}
          >
            <Icon className="size-5" />
          </div>

          {badge && (
            <Badge className="border-0 bg-emerald-600 text-white hover:bg-emerald-600">
              {badge}
            </Badge>
          )}
        </div>

        <h3 className="mt-6 text-xl font-semibold">{name}</h3>

        <p className="mt-2 min-h-14 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-7 flex items-end gap-1">
          <span className="mb-2 text-lg font-medium text-muted-foreground">
            $
          </span>

          <span className="text-5xl font-bold tracking-[-0.055em]">
            {price}
          </span>

          <span className="mb-1.5 text-sm text-muted-foreground">/ month</span>
        </div>

        <div className="my-7 h-px bg-border" />

        <div className="flex-1 space-y-3">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
              </div>

              <span className="text-sm leading-5 text-muted-foreground">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <a
          href="#request-account"
          className={cn(
            buttonVariants({
              size: "lg",

              variant: featured ? "default" : "outline",
            }),

            "mt-8 w-full",

            featured &&
              "bg-emerald-600 text-white shadow-md shadow-emerald-500/15 hover:bg-emerald-700"
          )}
        >
          Request {name}
          <ArrowRight className="size-4" />
        </a>
      </div>
    </article>
  );
}

/*
 * =========================================================
 * Request Step
 * =========================================================
 */

function RequestStep({
  number,
  text,
}: {
  number: string;

  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20">
        {number}
      </div>

      <p className="pt-0.5 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
