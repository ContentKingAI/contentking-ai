"use client";

import { CreditCard, ExternalLink, RotateCcw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { billingService } from "@/services/billingService";
import { formatDate, formatMoney } from "@/lib/format";

export default function BillingPage() {
  const { user, subscription, isSubscribed, activateSubscription, cancelSubscription } = useAppState();
  const [portalMessage, setPortalMessage] = useState("");

  async function handlePortal() {
    if (!user) {
      return;
    }

    const portal = await billingService.openCustomerPortal(user.id);
    setPortalMessage(`Mock customer portal ready at ${portal.url}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase text-coral">Billing</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Subscription management</h1>
        <p className="mt-2 text-ink/70">Mock Stripe state now, production Checkout and Portal later.</p>
      </div>

      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge tone={isSubscribed ? "success" : "warning"}>
              {isSubscribed ? "Active subscription" : "No active subscription"}
            </Badge>
            <h2 className="mt-4 text-2xl font-black text-ink">ContentKing AI Yearly</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
              The billing panel is mocked now and ready for Checkout, webhooks, and Customer Portal later.
            </p>
          </div>
          <div className="rounded-lg bg-cloud p-4 text-right">
            <p className="text-4xl font-black text-ink">{formatMoney(subscription?.priceCents ?? 6700)}</p>
            <p className="text-sm font-bold text-ink/60">per year</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-cloud p-4">
            <ShieldCheck className="h-5 w-5 text-mint" />
            <p className="mt-3 text-sm font-black text-ink">Status</p>
            <p className="mt-1 text-sm text-ink/60">{subscription?.status ?? "inactive"}</p>
          </div>
          <div className="rounded-lg bg-cloud p-4">
            <CreditCard className="h-5 w-5 text-coral" />
            <p className="mt-3 text-sm font-black text-ink">Renewal</p>
            <p className="mt-1 text-sm text-ink/60">{formatDate(subscription?.currentPeriodEnd)}</p>
          </div>
          <div className="rounded-lg bg-cloud p-4">
            <RotateCcw className="h-5 w-5 text-honey" />
            <p className="mt-3 text-sm font-black text-ink">Provider</p>
            <p className="mt-1 text-sm text-ink/60">Mock Stripe</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {isSubscribed ? (
            <>
              <Button onClick={handlePortal}>
                <ExternalLink className="h-4 w-4" />
                Open customer portal
              </Button>
              <Button onClick={cancelSubscription} variant="danger">
                Cancel demo plan
              </Button>
            </>
          ) : (
            <Button onClick={activateSubscription}>
              <CreditCard className="h-4 w-4" />
              Subscribe yearly
            </Button>
          )}
        </div>

        {portalMessage ? (
          <p className="mt-4 rounded-lg bg-mint/10 p-3 text-sm font-semibold text-ink">{portalMessage}</p>
        ) : null}
      </section>
    </div>
  );
}
