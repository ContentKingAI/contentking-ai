"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, History, Home, LayoutTemplate, ShieldCheck, WandSparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { cn } from "@/lib/format";
import { billingPlans } from "@/services/billingService";

const dashboardNav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/generator", label: "Generator", icon: WandSparkles },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/admin", label: "Admin", icon: ShieldCheck }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isReady, generations, isSubscribed, subscription } = useAppState();
  const activePlanLabel = subscription ? billingPlans[subscription.plan].title : "Locked";

  if (!isReady) {
    return (
      <section className="brand-page px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase text-mint">Loading workspace</p>
          <div className="mt-4 h-3 w-64 animate-pulse rounded-full bg-cloud" />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="brand-page px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-ink/10 bg-white p-8 text-center shadow-soft">
          <p className="text-sm font-black uppercase text-coral">Sign in required</p>
          <h1 className="mt-3 text-3xl font-black text-ink">Open your ContentKing AI workspace.</h1>
          <p className="mt-3 text-ink/70">
            Paid dashboard access starts with a monthly or yearly plan.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/demo" variant="secondary">
              Try demo
            </ButtonLink>
            <ButtonLink href="/pricing">Choose a plan</ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="brand-page px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-black text-ink">{user.name}</p>
              <p className="mt-1 break-all text-xs font-semibold text-ink/60">{user.email}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-cloud p-3">
                <BarChart3 className="h-4 w-4 text-coral" />
                <p className="mt-2 text-xl font-black text-ink">{generations.length}</p>
                <p className="text-xs font-bold text-ink/60">Saved</p>
              </div>
              <div className="rounded-lg bg-cloud p-3">
                <CreditCard className="h-4 w-4 text-mint" />
                <p className="mt-2 text-sm font-black text-ink">{isSubscribed ? activePlanLabel : "Locked"}</p>
                <p className="text-xs font-bold text-ink/60">Plan</p>
              </div>
            </div>
            <nav className="mt-4 space-y-1">
              {dashboardNav.map((item) => (
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-ink/70 hover:bg-cloud hover:text-ink",
                    pathname === item.href && "bg-cloud font-black text-ink"
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}
