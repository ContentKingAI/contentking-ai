"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { aiService } from "@/services/aiService";
import { authService, type AuthCredentials, type SignupInput } from "@/services/authService";
import { billingService } from "@/services/billingService";
import { historyService } from "@/services/historyService";
import type {
  BillingPlanId,
  GenerationInput,
  GenerationRecord,
  SubscriptionRecord,
  UserRecord
} from "@/types/saas";

interface AppStateContextValue {
  isReady: boolean;
  user: UserRecord | null;
  subscription: SubscriptionRecord | null;
  generations: GenerationRecord[];
  isSubscribed: boolean;
  signUp(input: SignupInput): Promise<void>;
  signIn(input: AuthCredentials): Promise<void>;
  signOut(): Promise<void>;
  activateSubscription(planId?: BillingPlanId): Promise<void>;
  cancelSubscription(): Promise<void>;
  generateContent(input: GenerationInput): Promise<GenerationRecord>;
  deleteGeneration(id: string): Promise<void>;
  refresh(): Promise<void>;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

function isActive(subscription: SubscriptionRecord | null) {
  return subscription?.subscriptionStatus === "active";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<UserRecord | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);

  const loadUserData = useCallback(async (currentUser: UserRecord | null) => {
    if (!currentUser) {
      setSubscription(null);
      setGenerations([]);
      return;
    }

    const [nextSubscription, nextGenerations] = await Promise.all([
      billingService.getSubscription(currentUser.id),
      historyService.listGenerations(currentUser.id)
    ]);
    setSubscription(nextSubscription);
    setGenerations(nextGenerations);
  }, []);

  const refresh = useCallback(async () => {
    const session = await authService.getSession();
    const nextUser = session?.user ?? null;
    setUser(nextUser);
    await loadUserData(nextUser);
    setIsReady(true);
  }, [loadUserData]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      isReady,
      user,
      subscription,
      generations,
      isSubscribed: isActive(subscription),
      async signUp(input) {
        if (!billingService.hasActiveCheckoutSelection()) {
          throw new Error("Choose a plan to create your account.");
        }

        const session = await authService.signUp(input);
        await billingService.activateSelectedPlanForUser(session.user.id);
        setUser(session.user);
        await loadUserData(session.user);
      },
      async signIn(input) {
        if (!billingService.hasActiveCheckoutSelection()) {
          throw new Error("Choose a plan to create your account.");
        }

        const session = await authService.signIn(input);
        await billingService.activateSelectedPlanForUser(session.user.id);
        setUser(session.user);
        await loadUserData(session.user);
      },
      async signOut() {
        await authService.signOut();
        setUser(null);
        setSubscription(null);
        setGenerations([]);
      },
      async activateSubscription(planId = "yearly") {
        if (!user) {
          throw new Error("Sign in before subscribing.");
        }

        const nextSubscription = await billingService.activatePlan(user.id, planId);
        setSubscription(nextSubscription);
      },
      async cancelSubscription() {
        if (!user) {
          return;
        }

        const nextSubscription = await billingService.cancelPlan(user.id);
        setSubscription(nextSubscription);
      },
      async generateContent(input) {
        if (!user) {
          throw new Error("Sign in to generate content.");
        }

        if (!isActive(subscription)) {
          throw new Error("Choose a monthly or yearly plan to generate content.");
        }

        const chargedSubscription = await billingService.consumeTextGeneration(user.id);
        setSubscription(chargedSubscription);
        const output = await aiService.generateContent(input);
        const generation = await historyService.saveGeneration(user.id, input, output);
        setGenerations((current) => [generation, ...current]);
        return generation;
      },
      async deleteGeneration(id) {
        if (!user) {
          return;
        }

        await historyService.deleteGeneration(user.id, id);
        setGenerations((current) => current.filter((item) => item.id !== id));
      },
      refresh
    }),
    [generations, isReady, loadUserData, refresh, subscription, user]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider.");
  }

  return context;
}
