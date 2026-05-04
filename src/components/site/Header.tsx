"use client";

import Link from "next/link";
import { Crown, LogOut, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { cn } from "@/lib/format";
import { billingPlans } from "@/services/billingService";

const publicNavItems = [
  { href: "/pricing", label: "Pricing" },
  { href: "/templates", label: "Templates" },
  { href: "/demo", label: "Private Demo" }
];

const customerNavItems = [
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/history", label: "History" }
];

export function Header() {
  const router = useRouter();
  const { user, signOut, isSubscribed, subscription } = useAppState();
  const [open, setOpen] = useState(false);
  const activePlanLabel = subscription ? billingPlans[subscription.plan].title : "Plan";
  const navItems = user && isSubscribed ? customerNavItems : publicNavItems;

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050b17]/92 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2 font-black tracking-tight text-white" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink">
            <Crown aria-hidden className="h-5 w-5" />
          </span>
          ContentKing AI
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-lg bg-cloud px-3 py-2 text-sm font-semibold text-ink">
                <Sparkles className={cn("h-4 w-4", isSubscribed ? "text-mint" : "text-honey")} />
                {isSubscribed ? `${activePlanLabel} active` : "Plan required"}
              </span>
              {!isSubscribed ? <ButtonLink href="/pricing">Choose plan</ButtonLink> : null}
              <Button className="text-white hover:bg-white/10" variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/demo" variant="secondary">
                Try Private Demo
              </ButtonLink>
              <ButtonLink href="/pricing">Start Creating</ButtonLink>
            </>
          )}
        </div>

        <Button
          aria-label="Open navigation"
          className="h-11 w-11 px-0 md:hidden"
          onClick={() => setOpen((value) => !value)}
          variant="secondary"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#050b17] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                className="rounded-lg px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                {!isSubscribed ? <ButtonLink href="/pricing">Choose plan</ButtonLink> : null}
                <Button className="justify-start text-white hover:bg-white/10" onClick={handleSignOut} variant="ghost">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <ButtonLink href="/demo" variant="secondary">
                  Demo
                </ButtonLink>
                <ButtonLink href="/pricing">Start</ButtonLink>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
