import { PaidAccessGuard } from "@/components/auth/PaidAccessGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PaidAccessGuard>
      <DashboardShell>{children}</DashboardShell>
    </PaidAccessGuard>
  );
}
