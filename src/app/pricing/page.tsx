"use client";

import { Check, CreditCard, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { formatDate } from "@/lib/format";

const benefits = [
  "Unlimited prototype access",
  "Weekly AI content pack generator",
  "Saved generation history",
  "Mock Stripe subscription state",
  "Ready for real Stripe Checkout later"
];

export default function PricingPage() {
  const router = useRouter();
  const { user, isSubscribed, subscription, activateSubscription } = useAppState();

  async function handleSubscribe() {
    if (!user) {
      router.push("/signup");
      return;
    }

    await activateSubscription();
    router.push("/dashboard");
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <Badge tone="success">Simple yearly plan</Badge>
          <h1 className="mt-5 text-4xl font-black text-ink sm:text-5xl">Pricing for ContentKing AI</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/70">
            A clean subscription flow for the prototype, ready to become Stripe Checkout when keys are connected.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-xl rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-coral">Yearly</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Creator plan</h2>
            </div>
            <CreditCard className="h-7 w-7 text-mint" />
          </div>

          <div className="mt-6 flex items-end gap-2">
            <span className="text-6xl font-black text-ink">$67</span>
            <span className="pb-2 text-sm font-semibold text-ink/60">per year</span>
          </div>

          <div className="mt-6 space-y-3">
            {benefits.map((benefit) => (
              <div className="flex items-center gap-3" key={benefit}>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint/15 text-ink">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-ink/75">{benefit}</span>
              </div>
            ))}
          </div>

          <Button className="mt-8 w-full" onClick={handleSubscribe}>
            <Sparkles className="h-4 w-4" />
            {isSubscribed ? "Open dashboard" : "Subscribe yearly"}
          </Button>

          {isSubscribed ? (
            <p className="mt-4 rounded-lg bg-mint/10 p-3 text-sm font-semibold text-ink">
              Active until {formatDate(subscription?.currentPeriodEnd)}.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
