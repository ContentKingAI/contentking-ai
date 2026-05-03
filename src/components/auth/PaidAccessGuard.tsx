"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { authService } from "@/services/authService";
import { billingService } from "@/services/billingService";

export function PaidAccessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isReady, isSubscribed, refresh, user } = useAppState();
  const hasHandledPayment = useRef(false);
  const [hasCheckedCheckout, setHasCheckedCheckout] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    setHasCheckedCheckout(true);
  }, []);

  useEffect(() => {
    if (!isReady || !hasCheckedCheckout) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const paymentSucceeded = params.get("payment") === "success";

    if (paymentSucceeded && !hasHandledPayment.current) {
      hasHandledPayment.current = true;
      setIsProcessingPayment(true);

      async function completePayment() {
        const selection = billingService.markPaymentSuccess();

        if (!selection) {
          billingService.clearCheckoutSelection();
          authService.clearPendingSignUp();
          router.replace("/pricing");
          return;
        }

        let activeUser = user;

        if (!activeUser) {
          const session = await authService.completePendingSignUp();
          activeUser = session?.user ?? null;
        }

        if (!activeUser) {
          billingService.clearCheckoutSelection();
          authService.clearPendingSignUp();
          router.replace("/pricing");
          return;
        }

        await billingService.activateSelectedPlanForUser(activeUser.id);
        await refresh();
        router.replace("/dashboard");
        setIsProcessingPayment(false);
      }

      void completePayment();
      return;
    }

    if (!paymentSucceeded && (!user || !isSubscribed)) {
      router.replace("/pricing");
    }
  }, [hasCheckedCheckout, isReady, isSubscribed, refresh, router, user]);

  if (!isReady || !hasCheckedCheckout || isProcessingPayment) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase text-mint">
            {isProcessingPayment ? "Activating subscription" : "Checking access"}
          </p>
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
            Paid dashboard access starts after a successful Stripe payment.
          </p>
          <ButtonLink className="mt-5 w-full" href="/pricing">
            Choose a plan
          </ButtonLink>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
