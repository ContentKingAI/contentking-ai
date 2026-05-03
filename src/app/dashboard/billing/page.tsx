"use client";

import { CreditCard, ExternalLink, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { billingPlans, billingService, extraCreditAddOns } from "@/services/billingService";
import { formatDate, formatMoney } from "@/lib/format";
import type { BillingPlanId } from "@/types/saas";

const planOrder: BillingPlanId[] = ["monthly", "yearly"];

export default function BillingPage() {
  const { user, subscription, isSubscribed, activateSubscription, cancelSubscription } = useAppState();
  const [portalMessage, setPortalMessage] = useState("");
  const activePlan = subscription ? billingPlans[subscription.plan] : billingPlans.yearly;
  const creditsUsed = subscription?.textGenerationsUsed ?? 0;
  const creditsLimit = activePlan.textGenerationLimit;
  const creditsLeft = Math.max(0, creditsLimit - creditsUsed);

  async function handlePortal() {
    if (!user) {
      return;
    }

    const portal = await billingService.openCustomerPortal(user.id);
    setPortalMessage(`Mock customer portal ready at ${portal.url}`);
  }

  async function handleChoosePlan(planId: BillingPlanId) {
    setPortalMessage("");
    await activateSubscription(planId);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase text-coral">Billing</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Subscription management</h1>
        <p className="mt-2 text-ink/70">Manage monthly or yearly in the mock billing flow today, then wire this to Stripe later.</p>
      </div>

      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge tone={isSubscribed ? "success" : "warning"}>
              {isSubscribed ? `${activePlan.title} plan active` : "No active subscription"}
            </Badge>
            <h2 className="mt-4 text-2xl font-black text-ink">
              {isSubscribed ? activePlan.name : "Choose a ContentKing AI plan"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
              The selected plan and content pack usage are stored in the existing mock subscription state.
            </p>
          </div>
          <div className="rounded-lg bg-cloud p-4 text-right">
            <p className="text-4xl font-black text-ink">{formatMoney(activePlan.priceCents)}</p>
            <p className="text-sm font-bold text-ink/60">per {activePlan.billingInterval}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-cloud p-4">
            <ShieldCheck className="h-5 w-5 text-mint" />
            <p className="mt-3 text-sm font-black text-ink">Status</p>
            <p className="mt-1 text-sm text-ink/60">{subscription?.subscriptionStatus ?? "inactive"}</p>
          </div>
          <div className="rounded-lg bg-cloud p-4">
            <CreditCard className="h-5 w-5 text-coral" />
            <p className="mt-3 text-sm font-black text-ink">Active plan</p>
            <p className="mt-1 text-sm text-ink/60">{isSubscribed ? activePlan.title : "None"}</p>
          </div>
          <div className="rounded-lg bg-cloud p-4">
            <RotateCcw className="h-5 w-5 text-honey" />
            <p className="mt-3 text-sm font-black text-ink">Renewal</p>
            <p className="mt-1 text-sm text-ink/60">{formatDate(subscription?.currentPeriodEnd)}</p>
          </div>
        </div>

        {isSubscribed ? (
          <div className="mt-6 rounded-lg border border-ink/10 bg-cloud p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-ink">AI content pack credits</p>
                <p className="mt-1 text-sm text-ink/70">
                  AI content packs left: {creditsLeft} / {creditsLimit}
                </p>
              </div>
              <p className="text-sm font-semibold text-ink/60">
                {creditsUsed.toLocaleString()} used this billing {activePlan.billingInterval}
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-mint"
                style={{ width: `${Math.min(100, (creditsUsed / creditsLimit) * 100)}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {planOrder.map((planId) => {
            const plan = billingPlans[planId];
            const isYearly = planId === "yearly";
            const isCurrentPlan = isSubscribed && subscription?.plan === planId;

            return (
              <article
                className={`relative rounded-lg border p-5 ${
                  isYearly ? "border-mint bg-mint/5 ring-2 ring-mint/15" : "border-ink/10 bg-white"
                }`}
                key={plan.id}
              >
                {isYearly ? (
                  <span className="absolute right-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-black uppercase text-white">
                    {plan.label}
                  </span>
                ) : null}
                <p className="text-sm font-black uppercase text-coral">
                  {isYearly ? "Recommended" : plan.label}
                </p>
                <h3 className="mt-2 text-xl font-black text-ink">{plan.name}</h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-black text-ink">{formatMoney(plan.priceCents)}</span>
                  <span className="pb-1 text-sm font-semibold text-ink/60">per {plan.billingInterval}</span>
                </div>
                <p className={`mt-3 text-sm font-black ${isYearly ? "text-mint" : "text-ink/60"}`}>
                  {plan.description}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink/70">
                  {plan.textGenerationLimit.toLocaleString()} AI content packs per {plan.billingInterval}
                </p>
                <Button
                  className="mt-5 w-full"
                  disabled={isCurrentPlan}
                  onClick={() => handleChoosePlan(planId)}
                  variant={isYearly ? "primary" : "secondary"}
                >
                  <Sparkles className="h-4 w-4" />
                  {isCurrentPlan ? "Current plan" : isSubscribed ? `Switch to ${plan.title}` : plan.cta}
                </Button>
              </article>
            );
          })}
        </div>

        <section className="mt-6 rounded-lg border border-ink/10 bg-white p-5">
          <p className="text-sm font-black uppercase text-coral">Future add-ons</p>
          <h3 className="mt-2 text-xl font-black text-ink">Extra AI content pack credits</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {extraCreditAddOns.map((addOn) => (
              <article className="rounded-lg bg-cloud p-4" key={addOn.id}>
                <p className="text-2xl font-black text-ink">{addOn.credits.toLocaleString()}</p>
                <p className="text-sm font-semibold text-ink/60">extra AI content packs</p>
                <p className="mt-3 text-lg font-black text-ink">${addOn.price}</p>
                <p className="mt-1 text-xs font-bold text-ink/50">{addOn.stripeEnvKey}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {isSubscribed ? (
            <>
              <Button onClick={handlePortal}>
                <ExternalLink className="h-4 w-4" />
                Open customer portal
              </Button>
              <Button onClick={cancelSubscription} variant="danger">
                Cancel plan
              </Button>
            </>
          ) : null}
        </div>

        {portalMessage ? (
          <p className="mt-4 rounded-lg bg-mint/10 p-3 text-sm font-semibold text-ink">{portalMessage}</p>
        ) : null}
      </section>
    </div>
  );
}
