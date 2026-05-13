"use client";

import { Database, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { PaidAccessGuard } from "@/components/auth/PaidAccessGuard";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import { contentTemplates } from "@/data/templates";
import { formatDate } from "@/lib/format";
import { adminResources } from "@/modules/admin/resources";
import { authService } from "@/services/authService";
import { historyService } from "@/services/historyService";
import { profileService } from "@/services/profileService";
import type { GenerationRecord, ProfileRecord } from "@/types/saas";

export default function AdminPage() {
  return (
    <PaidAccessGuard>
      <AdminContent />
    </PaidAccessGuard>
  );
}

function AdminContent() {
  const { user, isReady } = useAppState();
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadAdminData() {
      setAdminError("");

      try {
        const accessToken = await authService.getAccessToken();

        if (!accessToken) {
          throw new Error("Sign in with Supabase to view customer profiles.");
        }

        const [nextProfiles, nextGenerations] = await Promise.all([
          profileService.listProfiles(accessToken),
          historyService.listAllGenerations()
        ]);
        setProfiles(nextProfiles);
        setGenerations(nextGenerations);
      } catch (error) {
        setAdminError(error instanceof Error ? error.message : "Unable to load Supabase profiles.");
      }
    }

    void loadAdminData();
  }, [user]);

  if (!isReady) {
    return (
      <section className="brand-page px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg bg-white p-8 shadow-sm">Loading admin...</div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="brand-page px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-8 w-8 text-coral" />
          <h1 className="mt-4 text-3xl font-black text-ink">Admin access needs a paid account.</h1>
          <ButtonLink className="mt-6" href="/pricing">
            Choose a plan
          </ButtonLink>
        </div>
      </section>
    );
  }

  const counts: Record<string, number> = {
    users: profiles.length,
    subscriptions: profiles.filter((profile) => profile.subscriptionStatus === "active").length,
    generations: generations.length,
    templates: contentTemplates.length
  };

  return (
    <section className="brand-page px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone={user.role === "admin" ? "success" : "neutral"}>{user.role}</Badge>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Customer profiles</h1>
            <p className="mt-2 max-w-2xl text-white/70">
              View signed-up Supabase users and their plan, subscription status, and content credit usage.
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-coral">Supabase profiles</p>
              <h2 className="mt-2 text-xl font-black text-ink">All customers</h2>
            </div>
            <div className="rounded-lg bg-cloud px-4 py-3 text-sm font-black text-ink">
              {profiles.length} total
            </div>
          </div>

          {adminError ? (
            <div className="mt-5 rounded-lg border border-coral/25 bg-coral/10 p-4 text-sm font-semibold text-ink">
              {adminError}
            </div>
          ) : null}

          <div className="mt-5 overflow-hidden rounded-lg border border-ink/10">
            <div className="grid bg-cloud px-4 py-3 text-xs font-black uppercase text-ink/50 md:grid-cols-[1.6fr_0.7fr_0.9fr_0.8fr_0.9fr]">
              <span>Email</span>
              <span>Plan</span>
              <span>Status</span>
              <span>Credits used</span>
              <span>Created</span>
            </div>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <div
                  className="grid gap-2 border-t border-ink/10 px-4 py-4 text-sm md:grid-cols-[1.6fr_0.7fr_0.9fr_0.8fr_0.9fr]"
                  key={profile.id}
                >
                  <span className="break-all font-bold text-ink">{profile.email}</span>
                  <span className="font-semibold capitalize text-ink/70">{profile.plan}</span>
                  <span className="font-semibold capitalize text-ink/70">{profile.subscriptionStatus}</span>
                  <span className="font-semibold text-ink/70">
                    {profile.textGenerationsUsed} / {profile.textGenerationLimit}
                  </span>
                  <span className="font-semibold text-ink/60">{formatDate(profile.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="border-t border-ink/10 px-4 py-8 text-center">
                <UsersRound className="mx-auto h-8 w-8 text-ink/30" />
                <p className="mt-3 text-sm font-semibold text-ink/60">
                  No Supabase profiles loaded yet.
                </p>
              </div>
            )}
          </div>
        </section>

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
