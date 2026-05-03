"use client";

import { Check, CreditCard, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { formatMoney } from "@/lib/format";
import { billingPlans, billingService } from "@/services/billingService";
import type { BillingPlanId } from "@/types/saas";

const planOrder: BillingPlanId[] = ["monthly", "yearly"];

const planFeatures: Record<BillingPlanId, string[]> = {
  monthly: ["300 AI content packs/month", "Cancel anytime", "Mock subscription activated instantly"],
  yearly: ["5,000 AI content packs/year", "Save $65/year", "Best value for consistent posting"]
};

export default function CheckoutPage() {
  const router = useRouter();
  const { activateSubscription, user } = useAppState();
  const [preferredPlan, setPreferredPlan] = useState<string | null>(null);
  const [isChoosing, setIsChoosing] = useState<BillingPlanId | null>(null);

  useEffect(() => {
    setPreferredPlan(new URLSearchParams(window.location.search).get("plan"));
  }, []);

  async function handleChoosePlan(planId: BillingPlanId) {
    setIsChoosing(planId);
    billingService.selectCheckoutPlan(planId);

    if (user) {
      await activateSubscription(planId);
      router.push("/dashboard");
      return;
    }

    router.push("/signup");
  }

  return (
    <section className="bg-cloud px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Badge tone="success">Paid customer checkout</Badge>
          <h1 className="mt-5 text-4xl font-black text-ink sm:text-5xl">Choose your ContentKing AI plan</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-ink/70">
            This prototype stores a mock active subscription now. Later this page can be replaced with Stripe Checkout.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {planOrder.map((planId) => {
            const plan = billingPlans[planId];
            const isYearly = planId === "yearly";
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
                      {isYearly ? "Recommended" : "Flexible"}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-ink">{plan.title}</h2>
                  </div>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-6xl font-black text-ink">{formatMoney(plan.priceCents)}</span>
                  <span className="pb-2 text-sm font-semibold text-ink/60">
                    /{plan.billingInterval}
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
                  variant={isYearly ? "primary" : "secondary"}
                >
                  <Sparkles className="h-4 w-4" />
                  {isChoosing === planId ? "Activating..." : plan.cta}
                </Button>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-ink/60">
          Security note: payments are mocked with localStorage in this prototype. No real Stripe checkout is created yet.
        </p>
      </div>
    </section>
  );
}
