"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { billingService } from "@/services/billingService";

export function PaidAccessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isReady, isSubscribed, user } = useAppState();
  const [hasSelectedPlan, setHasSelectedPlan] = useState(false);
  const [hasCheckedCheckout, setHasCheckedCheckout] = useState(false);

  useEffect(() => {
    setHasSelectedPlan(billingService.hasActiveCheckoutSelection());
    setHasCheckedCheckout(true);
  }, []);

  useEffect(() => {
    if (!isReady || !hasCheckedCheckout) {
      return;
    }

    if (!user) {
      router.replace(hasSelectedPlan ? "/signup" : "/checkout");
      return;
    }

    if (!isSubscribed) {
      router.replace("/checkout");
    }
  }, [hasCheckedCheckout, hasSelectedPlan, isReady, isSubscribed, router, user]);

  if (!isReady || !hasCheckedCheckout) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase text-mint">Checking access</p>
          <div className="mt-4 h-3 w-64 animate-pulse rounded-full bg-cloud" />
        </div>
      </section>
    );
  }

  if (!user || !isSubscribed) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-lg border border-ink/10 bg-white p-6 text-center shadow-soft">
          <CreditCard className="mx-auto h-8 w-8 text-coral" />
          <h1 className="mt-4 text-2xl font-black text-ink">Choose a plan to continue.</h1>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Paid dashboard access starts with a monthly or yearly plan.
          </p>
          <ButtonLink className="mt-5 w-full" href="/checkout">
            Go to checkout
          </ButtonLink>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
