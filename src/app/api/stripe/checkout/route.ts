import { NextResponse } from "next/server";
import Stripe from "stripe";
import type { BillingPlanId } from "@/types/saas";

export const runtime = "nodejs";

type StripePlanId = Exclude<BillingPlanId, "free">;

const fallbackPriceIds: Record<StripePlanId, string> = {
  monthly: "price_1TT6SwKu4U4rqbAmPM6um33P",
  yearly: "price_1TT6TaKu4U4rqbAmGaZtbeDQ"
};

function isStripePlanId(value: unknown): value is StripePlanId {
  return value === "monthly" || value === "yearly";
}

function priceIdForPlan(plan: StripePlanId) {
  const envPriceId = plan === "monthly" ? process.env.STRIPE_MONTHLY_PRICE_ID : process.env.STRIPE_YEARLY_PRICE_ID;
  return envPriceId?.trim() || fallbackPriceIds[plan];
}

function priceEnvKeyForPlan(plan: StripePlanId) {
  return plan === "monthly" ? "STRIPE_MONTHLY_PRICE_ID" : "STRIPE_YEARLY_PRICE_ID";
}

function statusCodeForError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return 500;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const plan = body?.plan;

  if (!isStripePlanId(plan)) {
    return NextResponse.json({ error: "Choose a valid monthly or yearly plan." }, { status: 400 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured. Using mock checkout fallback.", code: "stripe_not_configured" },
      { status: 503 }
    );
  }

  const priceId = priceIdForPlan(plan);
  const priceEnvKey = priceEnvKeyForPlan(plan);

  if (!priceId.startsWith("price_")) {
    return NextResponse.json(
      {
        error: `${priceEnvKey} must be a recurring Stripe Price ID that starts with price_, not a Product ID.`
      },
      { status: 400 }
    );
  }

  if (!appUrl) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_APP_URL." }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  let session: Stripe.Checkout.Session;

  try {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      metadata: {
        plan
      },
      success_url: `${appUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=true`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create Stripe Checkout session.";
    return NextResponse.json({ error: message }, { status: statusCodeForError(error) });
  }

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
