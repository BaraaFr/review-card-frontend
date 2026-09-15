import {
    AuthGuard,
  } from "@/components/auth/auth-guard";
import { TawkChat } from "@/components/chatbot/tawk-chatbot";
  
  import {
    DashboardShell,
  } from "@/components/layout/dashboard-shell";
  
  export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <AuthGuard
        roles={[
          "BUSINESS_OWNER",
        ]}
      >
        <DashboardShell>
          {children}
        </DashboardShell>
        <TawkChat />
      </AuthGuard>
    );
  }