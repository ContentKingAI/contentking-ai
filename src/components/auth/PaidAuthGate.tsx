"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { billingService } from "@/services/billingService";
import type { BillingPlanId } from "@/types/saas";

function isBillingPlanId(value: string | null): value is BillingPlanId {
  return value === "monthly" || value === "yearly";
}

export function PaidAuthGate({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [hasSelectedPlan, setHasSelectedPlan] = useState(false);

  useEffect(() => {
    const queryPlan = new URLSearchParams(window.location.search).get("plan");

    if (isBillingPlanId(queryPlan)) {
      billingService.selectCheckoutPlan(queryPlan);
    }

    setHasSelectedPlan(billingService.hasSelectedPlan());
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <div className="h-3 w-48 animate-pulse rounded-full bg-cloud" />
        </div>
      </section>
    );
  }

  if (!hasSelectedPlan) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-lg border border-ink/10 bg-white p-6 text-center shadow-soft">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white">
            <CreditCard className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-3xl font-black text-ink">Choose a plan first</h1>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            Signup and login are part of the paid customer flow for this prototype.
          </p>
          <ButtonLink className="mt-6 w-full" href="/pricing">
            Choose a plan
          </ButtonLink>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
