"use client";

import { Check, CreditCard, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import { authService } from "@/services/authService";
import { billingPlans, billingService } from "@/services/billingService";
import type { BillingPlanId } from "@/types/saas";

const planOrder: BillingPlanId[] = ["free", "monthly", "yearly"];

const planFeatures: Record<BillingPlanId, string[]> = {
  free: ["10 AI content packs/month", "Basic captions/hooks/hashtags", "Limited templates", "No payment required"],
  monthly: ["300 AI content packs/month", "Cancel anytime", "Secure Stripe payment after signup"],
  yearly: ["5,000 AI content packs/year", "Save $65/year", "Best value for consistent posting"]
};

export default function CheckoutPage() {
  const router = useRouter();
  const [preferredPlan, setPreferredPlan] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isChoosing, setIsChoosing] = useState<BillingPlanId | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPreferredPlan(params.get("plan"));

    if (params.get("canceled") === "true") {
      billingService.clearCheckoutSelection();
      authService.clearPendingSignUp();
      setStatusMessage("Checkout was canceled. Choose a plan when you are ready.");
    }
  }, []);

  function handleChoosePlan(planId: BillingPlanId) {
    setIsChoosing(planId);
    billingService.selectCheckoutPlan(planId);
    router.push(`/signup?plan=${planId}`);
  }

  return (
    <section className="brand-page px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Badge tone="success">Plan selection</Badge>
          <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">Choose your ContentKing AI plan</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/70">
            Start free without payment, or pick monthly/yearly and finish payment through Stripe Checkout.
          </p>
        </div>

        {statusMessage ? (
          <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-honey/30 bg-honey/15 p-4 text-sm font-semibold text-ink">
            {statusMessage}
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {planOrder.map((planId) => {
            const plan = billingPlans[planId];
            const isYearly = planId === "yearly";
            const isFree = planId === "free";
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
                    Best Value
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
                    <h2 className="mt-1 text-2xl font-black text-ink">{plan.title}</h2>
                  </div>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-6xl font-black text-ink">{formatMoney(plan.priceCents)}</span>
                  <span className="pb-2 text-sm font-semibold text-ink/60">
                    /{isFree ? "month" : plan.billingInterval}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {planFeatures[planId].map((feature) => (
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
                  disabled={isChoosing !== null}
                  onClick={() => handleChoosePlan(planId)}
                  variant={isYearly || isFree ? "primary" : "secondary"}
                >
                  <Sparkles className="h-4 w-4" />
                  {isChoosing === planId ? "Selecting..." : plan.cta}
                </Button>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-white/60">
          Security note: payment starts after signup or login. `STRIPE_SECRET_KEY` is only read by the server route.
        </p>
      </div>
    </section>
  );
}
