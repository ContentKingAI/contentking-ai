"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { formatDate, formatMoney } from "@/lib/format";
import { billingPlans } from "@/services/billingService";

export function SubscriptionPanel() {
  const { isSubscribed, subscription } = useAppState();
  const activePlan = subscription ? billingPlans[subscription.plan] : billingPlans.yearly;
  const intervalLabel = activePlan.billingInterval === "year" ? "/year" : "/month";
  const creditsUsed = subscription?.textGenerationsUsed ?? 0;
  const creditsLimit = activePlan.textGenerationLimit;
  const creditsLeft = Math.max(0, creditsLimit - creditsUsed);

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone={isSubscribed ? "success" : "warning"}>
            {isSubscribed ? `${activePlan.title} active` : "Upgrade required"}
          </Badge>
          <h2 className="mt-3 text-xl font-black text-ink">Subscription</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            {isSubscribed
              ? `Your ${activePlan.title} plan renews on ${formatDate(subscription?.currentPeriodEnd)}.`
              : "Generation is locked until a mock monthly or yearly plan is active."}
          </p>
          {isSubscribed ? (
            <p className="mt-3 rounded-lg bg-cloud p-3 text-sm font-black text-ink">
              AI content packs left: {creditsLeft} / {creditsLimit}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <span className="text-2xl font-black text-ink">
            {formatMoney(activePlan.priceCents)}
            <span className="text-sm font-semibold text-ink/60">{intervalLabel}</span>
          </span>
          {isSubscribed ? (
            <Link className="text-sm font-black text-ink underline decoration-mint decoration-2 underline-offset-4" href="/dashboard/billing">
              Manage billing
            </Link>
          ) : (
            <ButtonLink href="/checkout">Choose a plan</ButtonLink>
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
