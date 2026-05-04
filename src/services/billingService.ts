import { addMonths, addYears, createId, readJson, removeStorage, writeJson } from "@/lib/storage";
import type {
  BillingInterval,
  BillingPlanId,
  MockSubscriptionStatus,
  SubscriptionRecord,
  SubscriptionStatus
} from "@/types/saas";

const SUBSCRIPTIONS_KEY = "contentking.subscriptions";
const SELECTED_PLAN_KEY = "selectedPlan";
const CHECKOUT_STATUS_KEY = "subscriptionStatus";
const CHECKOUT_LIMIT_KEY = "textGenerationLimit";
const CHECKOUT_USED_KEY = "textGenerationsUsed";
const CHECKOUT_INTERVAL_KEY = "billingInterval";

export const TEXT_CREDIT_LIMIT_REACHED =
  "You've used all your AI content packs for this billing period. Upgrade or buy more credits.";
export const FREE_CREDIT_LIMIT_REACHED = "You've used all free content packs. Upgrade to continue.";

export interface CheckoutSelection {
  plan: BillingPlanId;
  subscriptionStatus: MockSubscriptionStatus;
  price: 0 | 12 | 79;
  billingInterval: BillingInterval;
  textGenerationLimit: number;
  textGenerationsUsed: number;
}

export const extraCreditAddOns = [
  {
    id: "extra_500",
    credits: 500,
    price: 9,
    stripeEnvKey: "STRIPE_EXTRA_500_PRICE_ID"
  },
  {
    id: "extra_1500",
    credits: 1500,
    price: 19,
    stripeEnvKey: "STRIPE_EXTRA_1500_PRICE_ID"
  },
  {
    id: "extra_5000",
    credits: 5000,
    price: 49,
    stripeEnvKey: "STRIPE_EXTRA_5000_PRICE_ID"
  }
] as const;

export const billingPlans: Record<
  BillingPlanId,
  {
    id: BillingPlanId;
    name: string;
    title: string;
    label: string;
    price: 0 | 12 | 79;
    priceCents: number;
    billingInterval: BillingInterval;
    interval: BillingInterval;
    textGenerationLimit: number;
    cta: string;
    description: string;
    stripeEnvKey?: "STRIPE_MONTHLY_PRICE_ID" | "STRIPE_YEARLY_PRICE_ID";
  }
> = {
  free: {
    id: "free",
    name: "ContentKing AI Free",
    title: "Free Plan",
    label: "Try it first",
    price: 0,
    priceCents: 0,
    billingInterval: "free",
    interval: "free",
    textGenerationLimit: 10,
    cta: "Start Free",
    description: "No payment required",
    stripeEnvKey: undefined
  },
  monthly: {
    id: "monthly",
    name: "ContentKing AI Monthly",
    title: "Monthly",
    label: "Flexible",
    price: 12,
    priceCents: 1200,
    billingInterval: "month",
    interval: "month",
    textGenerationLimit: 300,
    cta: "Start Monthly",
    description: "Cancel anytime",
    stripeEnvKey: "STRIPE_MONTHLY_PRICE_ID"
  },
  yearly: {
    id: "yearly",
    name: "ContentKing AI Yearly",
    title: "Yearly",
    label: "Best Value",
    price: 79,
    priceCents: 7900,
    billingInterval: "year",
    interval: "year",
    textGenerationLimit: 5000,
    cta: "Start Yearly",
    description: "Save $65/year compared to monthly",
    stripeEnvKey: "STRIPE_YEARLY_PRICE_ID"
  }
};

type StoredSubscription = Partial<SubscriptionRecord> & {
  userId: string;
  planId?: BillingPlanId;
  interval?: BillingInterval;
  status?: SubscriptionStatus;
};

function readSubscriptions() {
  return readJson<StoredSubscription[]>(SUBSCRIPTIONS_KEY, []);
}

function isBillingPlanId(value: unknown): value is BillingPlanId {
  return value === "free" || value === "monthly" || value === "yearly";
}

function clampUsage(value: number, limit: number) {
  return Math.max(0, Math.min(value, limit));
}

function readCheckoutSelection(): CheckoutSelection | null {
  const selectedPlan = readJson<BillingPlanId | null>(SELECTED_PLAN_KEY, null);

  if (!isBillingPlanId(selectedPlan)) {
    return null;
  }

  const plan = billingPlans[selectedPlan];
  const subscriptionStatus = readJson<MockSubscriptionStatus>(CHECKOUT_STATUS_KEY, "inactive");
  const textGenerationsUsed = clampUsage(readJson<number>(CHECKOUT_USED_KEY, 0), plan.textGenerationLimit);
  const normalizedStatus =
    selectedPlan === "free" || subscriptionStatus === "free"
      ? "free"
      : subscriptionStatus === "active"
        ? "active"
        : "inactive";

  return {
    plan: selectedPlan,
    subscriptionStatus: normalizedStatus,
    price: plan.price,
    billingInterval: plan.billingInterval,
    textGenerationLimit: plan.textGenerationLimit,
    textGenerationsUsed
  };
}

function writeCheckoutSelection(planId: BillingPlanId, subscriptionStatus?: MockSubscriptionStatus) {
  const plan = billingPlans[planId];
  const nextStatus = subscriptionStatus ?? (planId === "free" ? "free" : "inactive");
  writeJson(SELECTED_PLAN_KEY, plan.id);
  writeJson(CHECKOUT_STATUS_KEY, nextStatus);
  writeJson(CHECKOUT_LIMIT_KEY, plan.textGenerationLimit);
  writeJson(CHECKOUT_USED_KEY, 0);
  writeJson(CHECKOUT_INTERVAL_KEY, plan.billingInterval);
  return readCheckoutSelection();
}

function clearCheckoutSelection() {
  removeStorage(SELECTED_PLAN_KEY);
  removeStorage(CHECKOUT_STATUS_KEY);
  removeStorage(CHECKOUT_LIMIT_KEY);
  removeStorage(CHECKOUT_USED_KEY);
  removeStorage(CHECKOUT_INTERVAL_KEY);
}

function writeSubscriptions(subscriptions: SubscriptionRecord[]) {
  writeJson(SUBSCRIPTIONS_KEY, subscriptions);
}

function statusToMockStatus(status?: SubscriptionStatus): MockSubscriptionStatus {
  if (status === "free") {
    return "free";
  }

  return status === "active" || status === "trialing" ? "active" : "inactive";
}

function planFromSubscription(subscription?: Partial<SubscriptionRecord> & { planId?: BillingPlanId }) {
  if (subscription?.plan) {
    return subscription.plan;
  }

  if (subscription?.planId) {
    return subscription.planId;
  }

  if (subscription?.interval === "free" || subscription?.subscriptionStatus === "free" || subscription?.status === "free") {
    return "free";
  }

  return subscription?.interval === "month" ? "monthly" : "yearly";
}

function periodEndFor(planId: BillingPlanId, start: Date) {
  const plan = billingPlans[planId];
  if (plan.billingInterval === "free") {
    return addMonths(start, 1).toISOString();
  }

  return plan.billingInterval === "year" ? addYears(start, 1).toISOString() : addMonths(start, 1).toISOString();
}

function subscriptionStatusToLegacyStatus(subscriptionStatus: MockSubscriptionStatus): SubscriptionStatus {
  if (subscriptionStatus === "free") {
    return "free";
  }

  return subscriptionStatus === "active" ? "active" : "inactive";
}

function inactiveSubscription(userId: string): SubscriptionRecord {
  const now = new Date().toISOString();
  const plan = billingPlans.free;

  return {
    id: createId("sub"),
    userId,
    status: "inactive",
    subscriptionStatus: "inactive",
    plan: plan.id,
    planName: plan.name,
    price: plan.price,
    priceCents: plan.priceCents,
    currency: "usd",
    billingInterval: plan.billingInterval,
    interval: plan.interval,
    textGenerationLimit: plan.textGenerationLimit,
    textGenerationsUsed: 0,
    createdAt: now,
    updatedAt: now
  };
}

function normalizeSubscription(subscription: StoredSubscription): SubscriptionRecord {
  const planId = planFromSubscription(subscription);
  const plan = billingPlans[planId];
  const now = new Date().toISOString();
  const subscriptionStatus = subscription.subscriptionStatus ?? statusToMockStatus(subscription.status);
  const used = Math.max(0, Math.min(subscription.textGenerationsUsed ?? 0, plan.textGenerationLimit));

  return {
    id: subscription.id ?? createId("sub"),
    userId: subscription.userId,
    stripeCustomerId: subscription.stripeCustomerId,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    status: subscriptionStatusToLegacyStatus(subscriptionStatus),
    subscriptionStatus,
    plan: plan.id,
    planName: plan.name,
    price: plan.price,
    priceCents: plan.priceCents,
    currency: "usd",
    billingInterval: plan.billingInterval,
    interval: plan.interval,
    textGenerationLimit: plan.textGenerationLimit,
    textGenerationsUsed: used,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    createdAt: subscription.createdAt ?? now,
    updatedAt: subscription.updatedAt ?? now
  };
}

function upsertSubscription(
  userId: string,
  subscriptionStatus: MockSubscriptionStatus,
  planId: BillingPlanId,
  initialUsage = 0,
  forceUsageReset = false
) {
  const subscriptions = readSubscriptions();
  const existing = subscriptions.find((item) => item.userId === userId);
  const normalizedExisting = existing ? normalizeSubscription(existing) : null;
  const plan = billingPlans[planId];
  const now = new Date();
  const shouldResetUsage =
    forceUsageReset ||
    !normalizedExisting ||
    normalizedExisting.plan !== planId ||
    (normalizedExisting.subscriptionStatus !== "active" && normalizedExisting.subscriptionStatus !== "free") ||
    subscriptionStatus !== normalizedExisting.subscriptionStatus;
  const next: SubscriptionRecord = {
    ...(normalizedExisting ?? inactiveSubscription(userId)),
    status: subscriptionStatusToLegacyStatus(subscriptionStatus),
    subscriptionStatus,
    plan: plan.id,
    planName: plan.name,
    price: plan.price,
    priceCents: plan.priceCents,
    billingInterval: plan.billingInterval,
    interval: plan.interval,
    textGenerationLimit: plan.textGenerationLimit,
    textGenerationsUsed: shouldResetUsage
      ? clampUsage(initialUsage, plan.textGenerationLimit)
      : normalizedExisting.textGenerationsUsed,
    stripeCustomerId: subscriptionStatus === "free" ? undefined : normalizedExisting?.stripeCustomerId ?? `cus_mock_${userId.slice(-8)}`,
    stripeSubscriptionId: subscriptionStatus === "free" ? undefined : normalizedExisting?.stripeSubscriptionId ?? `sub_mock_${userId.slice(-8)}`,
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEndFor(plan.id, now),
    updatedAt: now.toISOString()
  };

  writeSubscriptions([next, ...subscriptions.filter((item) => item.userId !== userId).map(normalizeSubscription)]);
  return next;
}

function replaceSubscription(subscription: SubscriptionRecord) {
  const subscriptions = readSubscriptions();
  writeSubscriptions([
    subscription,
    ...subscriptions.filter((item) => item.userId !== subscription.userId).map(normalizeSubscription)
  ]);
}

function getSubscriptionForUser(userId: string) {
  const subscription = readSubscriptions().find((item) => item.userId === userId);
  const normalized = subscription ? normalizeSubscription(subscription) : inactiveSubscription(userId);

  if (
    (normalized.subscriptionStatus === "active" || normalized.subscriptionStatus === "free") &&
    normalized.currentPeriodEnd &&
    Date.parse(normalized.currentPeriodEnd) <= Date.now()
  ) {
    const now = new Date();
    const resetSubscription = {
      ...normalized,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEndFor(normalized.plan, now),
      textGenerationsUsed: 0,
      updatedAt: now.toISOString()
    };
    replaceSubscription(resetSubscription);
    return resetSubscription;
  }

  return normalized;
}

function saveSubscription(subscription: SubscriptionRecord) {
  replaceSubscription(subscription);
}

export const billingService = {
  getCheckoutSelection(): CheckoutSelection | null {
    return readCheckoutSelection();
  },

  hasSelectedPlan() {
    return readCheckoutSelection() !== null;
  },

  hasActiveCheckoutSelection() {
    const selection = readCheckoutSelection();
    return selection?.subscriptionStatus === "active" || selection?.subscriptionStatus === "free";
  },

  selectCheckoutPlan(planId: BillingPlanId): CheckoutSelection | null {
    return writeCheckoutSelection(planId);
  },

  markPaymentSuccess(planId?: BillingPlanId): CheckoutSelection | null {
    const selectedPlan = planId ?? readCheckoutSelection()?.plan;

    if (!selectedPlan) {
      return null;
    }

    return writeCheckoutSelection(selectedPlan, selectedPlan === "free" ? "free" : "active");
  },

  clearCheckoutSelection() {
    clearCheckoutSelection();
  },

  async activateSelectedPlanForUser(userId: string): Promise<SubscriptionRecord> {
    const selection = readCheckoutSelection();

    if (!selection || (selection.subscriptionStatus !== "active" && selection.subscriptionStatus !== "free")) {
      throw new Error("Choose a plan to create your account.");
    }

    return upsertSubscription(
      userId,
      selection.plan === "free" ? "free" : "active",
      selection.plan,
      selection.textGenerationsUsed,
      true
    );
  },

  async getSubscription(userId: string): Promise<SubscriptionRecord> {
    return getSubscriptionForUser(userId);
  },

  async activatePlan(userId: string, planId: BillingPlanId): Promise<SubscriptionRecord> {
    return upsertSubscription(userId, planId === "free" ? "free" : "active", planId);
  },

  async activateYearlyPlan(userId: string): Promise<SubscriptionRecord> {
    return upsertSubscription(userId, "active", "yearly");
  },

  async cancelPlan(userId: string): Promise<SubscriptionRecord> {
    const currentPlan = getSubscriptionForUser(userId).plan;
    clearCheckoutSelection();
    return upsertSubscription(userId, "inactive", currentPlan);
  },

  async consumeTextGeneration(userId: string): Promise<SubscriptionRecord> {
    const subscription = getSubscriptionForUser(userId);

    if (subscription.subscriptionStatus !== "active" && subscription.subscriptionStatus !== "free") {
      throw new Error("Choose a plan to generate content.");
    }

    if (subscription.textGenerationsUsed >= subscription.textGenerationLimit) {
      if (subscription.subscriptionStatus === "free") {
        throw new Error(FREE_CREDIT_LIMIT_REACHED);
      }

      throw new Error(TEXT_CREDIT_LIMIT_REACHED);
    }

    const next = {
      ...subscription,
      textGenerationsUsed: subscription.textGenerationsUsed + 1,
      updatedAt: new Date().toISOString()
    };

    saveSubscription(next);
    return next;
  },

  async openCustomerPortal(userId: string) {
    return {
      url: `/dashboard/billing?portal=mock&customer=${encodeURIComponent(userId)}`
    };
  },

  async listSubscriptions(): Promise<SubscriptionRecord[]> {
    return readSubscriptions().map(normalizeSubscription);
  }
};
