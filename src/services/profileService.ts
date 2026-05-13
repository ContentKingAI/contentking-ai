import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { BillingPlanId, MockSubscriptionStatus, ProfileRecord } from "@/types/saas";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: BillingPlanId | null;
  subscription_status: MockSubscriptionStatus | null;
  text_generation_limit: number | null;
  text_generations_used: number | null;
  created_at: string | null;
};

type SupabaseLikeError = {
  message?: string;
  code?: string;
};

export interface ProfileBillingState {
  plan: BillingPlanId;
  subscriptionStatus: MockSubscriptionStatus;
  textGenerationLimit: number;
  textGenerationsUsed: number;
}

interface ProfileInput {
  id: string;
  email: string;
  fullName: string;
  billing: ProfileBillingState;
}

const profileSelect = "id,email,full_name,plan,subscription_status,text_generation_limit,text_generations_used,created_at";

function normalizeProfile(row: ProfileRow): ProfileRecord {
  return {
    id: row.id,
    email: row.email ?? "",
    fullName: row.full_name ?? "",
    plan: row.plan ?? "free",
    subscriptionStatus: row.subscription_status ?? "free",
    textGenerationLimit: row.text_generation_limit ?? 10,
    textGenerationsUsed: row.text_generations_used ?? 0,
    createdAt: row.created_at ?? new Date().toISOString()
  };
}

function profileError(action: string, error: SupabaseLikeError) {
  console.warn(`Supabase profile ${action} failed`, error);
  return new Error(`Unable to ${action} profile. Please try again or contact ContentKing AI support.`);
}

function profilePayload(input: ProfileInput) {
  return {
    id: input.id,
    email: input.email,
    full_name: input.fullName,
    plan: input.billing.plan,
    subscription_status: input.billing.subscriptionStatus,
    text_generation_limit: input.billing.textGenerationLimit,
    text_generations_used: input.billing.textGenerationsUsed
  };
}

function fullNameFromUser(user: User) {
  const metadataName = user.user_metadata?.full_name;
  return typeof metadataName === "string" && metadataName.trim() ? metadataName.trim() : "ContentKing Creator";
}

export const profileService = {
  async getProfile(userId: string): Promise<ProfileRecord | null> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .select(profileSelect)
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw profileError("load", error);
    }

    return data ? normalizeProfile(data as ProfileRow) : null;
  },

  async ensureProfile(input: ProfileInput): Promise<ProfileRecord> {
    const existingProfile = await this.getProfile(input.id);

    if (existingProfile) {
      return existingProfile;
    }

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .insert(profilePayload(input))
      .select(profileSelect)
      .maybeSingle();

    if (error) {
      const profileAfterInsertRace = await this.getProfile(input.id);

      if (profileAfterInsertRace) {
        return profileAfterInsertRace;
      }

      throw profileError("create", error);
    }

    if (data) {
      return normalizeProfile(data as ProfileRow);
    }

    const profile = await this.getProfile(input.id);

    if (profile) {
      return profile;
    }

    throw new Error("Unable to create profile. The profile row was not returned by Supabase.");
  },

  async upsertProfile(input: ProfileInput): Promise<ProfileRecord> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profilePayload(input), { onConflict: "id" })
      .select(profileSelect)
      .maybeSingle();

    if (error) {
      throw profileError("save", error);
    }

    if (data) {
      return normalizeProfile(data as ProfileRow);
    }

    const profile = await this.getProfile(input.id);

    if (profile) {
      return profile;
    }

    throw new Error("Unable to save profile. The profile row was not returned by Supabase.");
  },

  async updateBillingState(
    userId: string,
    billing: ProfileBillingState,
    fallback?: { email: string; fullName: string }
  ): Promise<ProfileRecord> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        plan: billing.plan,
        subscription_status: billing.subscriptionStatus,
        text_generation_limit: billing.textGenerationLimit,
        text_generations_used: billing.textGenerationsUsed
      })
      .eq("id", userId)
      .select(profileSelect)
      .maybeSingle();

    if (error) {
      throw profileError("update billing for", error);
    }

    if (data) {
      return normalizeProfile(data as ProfileRow);
    }

    if (fallback) {
      return this.upsertProfile({
        id: userId,
        email: fallback.email,
        fullName: fallback.fullName,
        billing
      });
    }

    const profile = await this.getProfile(userId);

    if (profile) {
      return profile;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user?.id === userId) {
      return this.ensureProfile({
        id: user.id,
        email: user.email ?? "",
        fullName: fullNameFromUser(user),
        billing
      });
    }

    throw new Error("Unable to update profile billing. No profile exists for this Supabase user.");
  },

  async updateUsage(userId: string, textGenerationsUsed: number): Promise<ProfileRecord | null> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ text_generations_used: textGenerationsUsed })
      .eq("id", userId)
      .select(profileSelect)
      .maybeSingle();

    if (error) {
      throw profileError("update usage for", error);
    }

    return data ? normalizeProfile(data as ProfileRow) : null;
  },

  async listProfiles(accessToken: string): Promise<ProfileRecord[]> {
    const response = await fetch("/api/admin/profiles", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const payload = (await response.json()) as { profiles?: ProfileRow[]; error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to load Supabase profiles.");
    }

    return (payload.profiles ?? []).map(normalizeProfile);
  }
};
