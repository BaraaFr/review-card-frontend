import {
    Radio,
    Sparkles,
    Star,
    TrendingUp,
  } from "lucide-react";
import ValYouLogo from "../landing/valyou-logo";
  
  type AuthShellProps = {
    children: React.ReactNode;
  
    title: string;
  
    description: string;
  };
  
  export function AuthShell({
    children,
    title,
    description,
  }: AuthShellProps) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background">
        {/* Ambient effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 size-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />
  
          <div className="absolute -bottom-48 -right-32 size-[550px] rounded-full bg-violet-500/10 blur-[150px]" />
  
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
              backgroundSize:
                "42px 42px",
            }}
          />
        </div>
  
        <div className="relative mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[1.05fr_.95fr]">
          {/* Marketing Side */}
          <section className="relative hidden flex-col justify-between p-12 lg:flex xl:p-16">
          <ValYouLogo />
  
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <Sparkles className="size-3.5" />
  
                Smart review growth
              </div>
  
              <h1 className="text-balance text-5xl font-semibold tracking-[-0.045em] text-foreground xl:text-6xl">
                Turn a simple tap into
                customer feedback.
              </h1>
  
              <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
                Smart NFC and QR cards
                that help your customers
                reach your review page
                instantly while giving
                you meaningful engagement
                insights.
              </p>
  
              <div className="mt-12 grid grid-cols-2 gap-4">
                <FeatureCard
                  icon={
                    <Radio className="size-5" />
                  }
                  value="Instant"
                  label="NFC interactions"
                />
  
                <FeatureCard
                  icon={
                    <TrendingUp className="size-5" />
                  }
                  value="Live"
                  label="Engagement analytics"
                />
              </div>
            </div>
  
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <div className="flex">
                {[
                  1,
                  2,
                  3,
                ].map(
                  (item) => (
                    <div
                      key={
                        item
                      }
                      className="-ml-1.5 flex size-7 first:ml-0 items-center justify-center rounded-full border border-[#08090d] bg-zinc-800"
                    >
                      <Star className="size-3 fill-emerald-400 text-emerald-400" />
                    </div>
                  )
                )}
              </div>
  
              Built for modern
              businesses
            </div>
          </section>
  
          {/* Form Side */}
          <section className="flex min-h-screen items-center justify-center p-5 sm:p-8 lg:p-12">
            <div className="w-full max-w-md">
              <div className="mb-10 lg:hidden">
                <Brand />
              </div>
  
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  {title}
                </h2>
  
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
  
              {children}
            </div>
          </section>
        </div>
      </main>
    );
  }
  
  function Brand() {
    return (
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-500 text-black shadow-lg shadow-emerald-500/10">
          <Radio className="size-5" />
        </div>
  
        <div>
          <div className="text-base font-semibold tracking-tight text-foreground">
          ValYou
          </div>
  
          <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Review intelligence
          </div>
        </div>
      </div>
    );
  }
  
  function FeatureCard({
    icon,
    value,
    label,
  }: {
    icon: React.ReactNode;
    value: string;
    label: string;
  }) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl">
        <div className="mb-4 flex size-9 items-center justify-center rounded-xl bg-white/[0.06] text-emerald-300">
          {icon}
        </div>
  
        <div className="text-xl font-semibold text-foreground">
          {value}
        </div>
  
        <div className="mt-1 text-sm text-zinc-500">
          {label}
        </div>
      </div>
    );
  }