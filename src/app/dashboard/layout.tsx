import { DemoAccessGate } from "@/components/auth/DemoAccessGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoAccessGate>
      <DashboardShell>{children}</DashboardShell>
    </DemoAccessGate>
  );
}
