"use client";

import Link from "next/link";
import { CreditCard, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { formatDate, formatMoney } from "@/lib/format";

export function SubscriptionPanel() {
  const { isSubscribed, subscription, activateSubscription } = useAppState();

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone={isSubscribed ? "success" : "warning"}>
            {isSubscribed ? "Yearly active" : "Upgrade required"}
          </Badge>
          <h2 className="mt-3 text-xl font-black text-ink">Subscription</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            {isSubscribed
              ? `Your ${subscription?.planName ?? "yearly plan"} renews on ${formatDate(subscription?.currentPeriodEnd)}.`
              : "Generation is locked until the mock yearly plan is active."}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <span className="text-2xl font-black text-ink">
            {formatMoney(subscription?.priceCents ?? 6700)}
            <span className="text-sm font-semibold text-ink/60">/year</span>
          </span>
          {isSubscribed ? (
            <Link className="text-sm font-black text-ink underline decoration-mint decoration-2 underline-offset-4" href="/dashboard/billing">
              Manage billing
            </Link>
          ) : (
            <Button onClick={activateSubscription}>
              <CreditCard className="h-4 w-4" />
              Subscribe yearly
            </Button>
          )}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-lg bg-cloud p-3 text-sm font-semibold text-ink/70">
        <Sparkles className="h-4 w-4 text-mint" />
        Billing state is mocked now and ready for a future Stripe connection.
      </div>
    </section>
  );
}
