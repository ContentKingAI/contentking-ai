"use client";

import { Check, CreditCard, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { formatDate, formatMoney } from "@/lib/format";
import { authService } from "@/services/authService";
import { billingPlans, billingService } from "@/services/billingService";
import type { BillingPlanId } from "@/types/saas";

const planFeatures = [
  "Saved generation history",
  "Mock Stripe subscription state",
  "Ready for real Stripe Checkout later",
  "Captions, reels hooks, hashtags, and calendars"
];

const planOrder: BillingPlanId[] = ["monthly", "yearly"];

export default function PricingPage() {
  const router = useRouter();
  const { isSubscribed, subscription } = useAppState();
  const [statusMessage, setStatusMessage] = useState("");
  const [preferredPlan, setPreferredPlan] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    setPreferredPlan(plan);

    if (params.get("canceled") === "true") {
      billingService.clearCheckoutSelection();
      authService.clearPendingSignUp();
      setStatusMessage("Payment was canceled. Choose a plan when you are ready.");
    }
  }, []);

  function handleSubscribe(planId: BillingPlanId) {
    billingService.selectCheckoutPlan(planId);
    router.push(`/signup?plan=${planId}`);
  }

  return (
    <section className="brand-page px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Badge tone="success">Flexible prototype pricing</Badge>
          <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">Pricing for ContentKing AI</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Choose a plan first, create your account, then finish securely through Stripe Checkout.
          </p>
        </div>

        {statusMessage ? (
          <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-honey/30 bg-honey/15 p-4 text-sm font-semibold text-ink">
            {statusMessage}
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {planOrder.map((planId) => {
            const plan = billingPlans[planId];
            const isYearly = planId === "yearly";
            const isCurrentPlan = isSubscribed && subscription?.plan === planId;
            const isPreferred = preferredPlan === planId;

            return (
              <article
                className={`relative rounded-lg border bg-white p-6 shadow-soft ${
                  isYearly || isPreferred ? "border-mint ring-2 ring-mint/20" : "border-ink/10"
                }`}
                key={plan.id}
              >
                {isYearly ? (
                  <span className="absolute right-5 top-5 rounded-full bg-ink px-3 py-1 text-xs font-black uppercase text-white">
                    {plan.label}
                  </span>
                ) : null}

                <div className="flex items-start gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${isYearly ? "bg-mint/15 text-ink" : "bg-cloud text-ink"}`}>
                    <CreditCard className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase text-coral">
                      {isYearly ? "Recommended" : plan.label}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-ink">{plan.name}</h2>
                  </div>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-6xl font-black text-ink">{formatMoney(plan.priceCents)}</span>
                  <span className="pb-2 text-sm font-semibold text-ink/60">
                    per {plan.billingInterval}
                  </span>
                </div>
                <p className={`mt-3 text-sm font-black ${isYearly ? "text-mint" : "text-ink/60"}`}>
                  {plan.description}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink/70">
                  Includes {plan.textGenerationLimit.toLocaleString()} AI content packs per {plan.billingInterval}.
                </p>

                <div className="mt-6 space-y-3">
                  {planFeatures.map((feature) => (
                    <div className="flex items-center gap-3" key={feature}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint/15 text-ink">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-ink/75">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="mt-8 w-full"
                  disabled={isCurrentPlan}
                  onClick={() => handleSubscribe(planId)}
                  variant={isYearly ? "primary" : "secondary"}
                >
                  <Sparkles className="h-4 w-4" />
                  {isCurrentPlan ? "Current plan" : plan.cta}
                </Button>

                {isCurrentPlan ? (
                  <p className="mt-4 rounded-lg bg-mint/10 p-3 text-sm font-semibold text-ink">
                    Active until {formatDate(subscription?.currentPeriodEnd)}.
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
