import {
    AuthGuard,
  } from "@/components/auth/auth-guard";
  
  import {
    DashboardShell,
  } from "@/components/layout/dashboard-shell";
  
  export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <AuthGuard
        roles={[
          "SUPER_ADMIN",
        ]}
      >
        <DashboardShell>
          {children}
        </DashboardShell>
      </AuthGuard>
    );
  }