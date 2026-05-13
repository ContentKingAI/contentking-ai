"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CreditCard, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { formatMoney } from "@/lib/format";
import { authService } from "@/services/authService";
import { billingPlans, billingService } from "@/services/billingService";
import type { BillingPlanId } from "@/types/saas";

function isBillingPlanId(value: string | null): value is BillingPlanId {
  return value === "free" || value === "monthly" || value === "yearly";
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { refresh } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("creator@contentking.ai");
  const [password, setPassword] = useState("contentking");
  const [selectedPlan, setSelectedPlan] = useState<BillingPlanId | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";
  const activePlan = selectedPlan ? billingPlans[selectedPlan] : null;
  const isFreePlan = selectedPlan === "free";

  useEffect(() => {
    const queryPlan = new URLSearchParams(window.location.search).get("plan");

    if (isBillingPlanId(queryPlan)) {
      billingService.selectCheckoutPlan(queryPlan);
      setSelectedPlan(queryPlan);
      return;
    }

    setSelectedPlan(billingService.getCheckoutSelection()?.plan ?? null);
  }, []);

  async function startPayment(planId: BillingPlanId) {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ plan: planId })
    });
    const data = (await response.json()) as { url?: string; error?: string; code?: string };

    if (response.ok && data.url) {
      window.location.assign(data.url);
      return;
    }

    if (data.code === "stripe_not_configured") {
      billingService.markPaymentSuccess(planId);
      const session = isSignup ? await authService.completePendingSignUp() : await authService.getSession();

      if (!session) {
        throw new Error("Unable to finish mock checkout.");
      }

      await billingService.activateSelectedPlanForUser(session.user.id);
      await refresh();
      router.push("/dashboard");
      return;
    }

    throw new Error(data.error ?? "Unable to start Stripe Checkout.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedPlan) {
      setError("Choose a plan first");
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedPlan === "free") {
        const session = isSignup
          ? await authService.signUp({ name, email, password })
          : await authService.signIn({ email, password });

        await billingService.activateSelectedPlanForUser(session.user.id);
        await refresh();
        router.push("/dashboard");
        return;
      }

      if (isSignup) {
        await authService.prepareSignUp({ name, email, password });
      } else {
        await authService.signIn({ email, password });
      }

      await startPayment(selectedPlan);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
          <Crown className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-ink">{isSignup ? "Create account" : "Welcome back"}</h1>
          <p className="text-sm text-ink/60">
            {isFreePlan ? "Free account access using local prototype auth." : "Paid customer access using local prototype auth."}
          </p>
        </div>
      </div>

      {activePlan ? (
        <div className="mt-5 rounded-lg border border-mint/25 bg-mint/10 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-ink">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase text-ink/60">Selected plan</p>
              <h2 className="mt-1 text-lg font-black text-ink">{activePlan.title}</h2>
              <p className="mt-1 text-sm font-semibold text-ink/70">
                {formatMoney(activePlan.priceCents)} / {activePlan.billingInterval === "free" ? "month" : activePlan.billingInterval} -{" "}
                {activePlan.textGenerationLimit.toLocaleString()} AI content packs
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {isSignup ? (
          <label className="block">
            <span className="text-sm font-bold text-ink">Name</span>
            <input
              className="field mt-2"
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Morgan"
              value={name}
            />
          </label>
        ) : null}

        <label className="block">
          <span className="text-sm font-bold text-ink">Email</span>
          <input
            className="field mt-2"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold text-ink" htmlFor="auth-password">
              Password
            </label>
            {!isSignup ? (
              <Link
                className="text-sm font-black text-ink underline decoration-mint decoration-2 underline-offset-4"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            ) : null}
          </div>
          <input
            className="field mt-2"
            id="auth-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </div>

        {error ? (
          <div className="rounded-lg border border-coral/25 bg-coral/10 p-3 text-sm font-semibold text-ink">
            {error}
          </div>
        ) : null}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting
            ? isFreePlan
              ? "Opening dashboard..."
              : "Opening Stripe Checkout..."
            : isFreePlan
              ? isSignup
                ? "Create free account"
                : "Log in"
              : isSignup
                ? "Create account and pay"
                : "Log in and pay"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/60">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          className="font-black text-ink underline decoration-mint decoration-2 underline-offset-4"
          href={`${isSignup ? "/login" : "/signup"}${selectedPlan ? `?plan=${selectedPlan}` : ""}`}
        >
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
