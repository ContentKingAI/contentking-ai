import { addYears, createId, readJson, writeJson } from "@/lib/storage";
import type { SubscriptionRecord, SubscriptionStatus } from "@/types/saas";

const SUBSCRIPTIONS_KEY = "contentking.subscriptions";

function readSubscriptions() {
  return readJson<SubscriptionRecord[]>(SUBSCRIPTIONS_KEY, []);
}

function writeSubscriptions(subscriptions: SubscriptionRecord[]) {
  writeJson(SUBSCRIPTIONS_KEY, subscriptions);
}

function inactiveSubscription(userId: string): SubscriptionRecord {
  const now = new Date().toISOString();

  return {
    id: createId("sub"),
    userId,
    status: "inactive",
    planName: "ContentKing AI Yearly",
    priceCents: 6700,
    currency: "usd",
    interval: "year",
    createdAt: now,
    updatedAt: now
  };
}

function upsertSubscription(userId: string, status: SubscriptionStatus) {
  const subscriptions = readSubscriptions();
  const existing = subscriptions.find((item) => item.userId === userId);
  const now = new Date();
  const currentPeriodEnd = addYears(now, 1).toISOString();
  const next: SubscriptionRecord = {
    ...(existing ?? inactiveSubscription(userId)),
    status,
    stripeCustomerId: existing?.stripeCustomerId ?? `cus_mock_${userId.slice(-8)}`,
    stripeSubscriptionId: existing?.stripeSubscriptionId ?? `sub_mock_${userId.slice(-8)}`,
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd,
    updatedAt: now.toISOString()
  };

  writeSubscriptions([next, ...subscriptions.filter((item) => item.userId !== userId)]);
  return next;
}

export const billingService = {
  async getSubscription(userId: string): Promise<SubscriptionRecord> {
    return readSubscriptions().find((item) => item.userId === userId) ?? inactiveSubscription(userId);
  },

  async activateYearlyPlan(userId: string): Promise<SubscriptionRecord> {
    return upsertSubscription(userId, "active");
  },

  async cancelPlan(userId: string): Promise<SubscriptionRecord> {
    return upsertSubscription(userId, "canceled");
  },

  async openCustomerPortal(userId: string) {
    return {
      url: `/dashboard/billing?portal=mock&customer=${encodeURIComponent(userId)}`
    };
  },

  async listSubscriptions(): Promise<SubscriptionRecord[]> {
    return readSubscriptions();
  }
};
