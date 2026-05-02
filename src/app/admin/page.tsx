"use client";

import { Database, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { contentTemplates } from "@/data/templates";
import { adminResources } from "@/modules/admin/resources";
import { authService } from "@/services/authService";
import { billingService } from "@/services/billingService";
import { historyService } from "@/services/historyService";
import type { GenerationRecord, SubscriptionRecord, UserRecord } from "@/types/saas";

export default function AdminPage() {
  const { user, isReady } = useAppState();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadAdminData() {
      const [nextUsers, nextSubscriptions, nextGenerations] = await Promise.all([
        authService.listUsers(),
        billingService.listSubscriptions(),
        historyService.listAllGenerations()
      ]);
      setUsers(nextUsers);
      setSubscriptions(nextSubscriptions);
      setGenerations(nextGenerations);
    }

    void loadAdminData();
  }, [user]);

  if (!isReady) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg bg-white p-8 shadow-sm">Loading admin...</div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-8 w-8 text-coral" />
          <h1 className="mt-4 text-3xl font-black text-ink">Admin access needs a demo account.</h1>
          <ButtonLink className="mt-6" href="/signup">
            Create account
          </ButtonLink>
        </div>
      </section>
    );
  }

  const counts: Record<string, number> = {
    users: users.length,
    subscriptions: subscriptions.length,
    generations: generations.length,
    templates: contentTemplates.length
  };

  return (
    <section className="bg-cloud px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone={user.role === "admin" ? "success" : "neutral"}>{user.role}</Badge>
            <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Admin-ready structure</h1>
            <p className="mt-2 max-w-2xl text-ink/70">
              Resource modules are already separated for users, subscriptions, generations, and templates.
            </p>
          </div>
          <ButtonLink href="/dashboard" variant="secondary">
            Back to dashboard
          </ButtonLink>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {adminResources.map((resource) => (
            <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm" key={resource.name}>
              <Database className="h-6 w-6 text-mint" />
              <h2 className="mt-4 text-lg font-black text-ink">{resource.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">{resource.description}</p>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-cloud p-3">
                <span className="text-xs font-black uppercase text-ink/50">{resource.futureTable}</span>
                <span className="text-xl font-black text-ink">{counts[resource.name] ?? 0}</span>
              </div>
            </article>
          ))}
        </div>

        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">Future backend mapping</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-ink/10">
            {adminResources.map((resource) => (
              <div className="grid gap-2 border-t border-ink/10 px-4 py-3 text-sm first:border-t-0 md:grid-cols-[0.7fr_0.8fr_1.4fr]" key={resource.name}>
                <strong className="text-ink">{resource.title}</strong>
                <span className="font-semibold text-ink/60">{resource.futureTable}</span>
                <span className="text-ink/60">{resource.description}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
