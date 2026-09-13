import {
  AppHeader,
} from "./app-header";

import {
  AppSidebar,
} from "./app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width":
            "17rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset className="min-w-0 bg-background">
        <AppHeader />

        <main className="relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 size-[450px] rounded-full bg-emerald-500/[0.055] blur-[130px]" />

            <div className="absolute right-0 top-20 size-[400px] rounded-full bg-violet-500/[0.045] blur-[140px]" />
          </div>

          <div className="relative mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}