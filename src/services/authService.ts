import type { User } from "@supabase/supabase-js";
import { readJson, removeStorage, writeJson } from "@/lib/storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { billingPlans } from "@/services/billingService";
import { profileService } from "@/services/profileService";
import type { UserRecord } from "@/types/saas";

const PENDING_SIGNUP_KEY = "contentking.pendingSignup";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupInput extends AuthCredentials {
  name: string;
}

export interface AuthSession {
  user: UserRecord;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function nameFromUser(user: User, fallback = "ContentKing Creator") {
  const metadataName = user.user_metadata?.full_name;
  return typeof metadataName === "string" && metadataName.trim() ? metadataName.trim() : fallback;
}

function publicUser(user: User, fallbackName?: string): UserRecord {
  const now = new Date().toISOString();
  const email = user.email ?? "";
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();

  return {
    id: user.id,
    name: nameFromUser(user, fallbackName),
    email,
    role: adminEmail && email.toLowerCase() === adminEmail ? "admin" : "user",
    createdAt: user.created_at ?? now,
    lastLoginAt: user.last_sign_in_at ?? now
  };
}

async function ensureProfile(user: User, fullName: string) {
  const plan = billingPlans.free;
  await profileService.upsertProfile({
    id: user.id,
    email: user.email ?? "",
    fullName,
    billing: {
      plan: plan.id,
      subscriptionStatus: "free",
      textGenerationLimit: plan.textGenerationLimit,
      textGenerationsUsed: 0
    }
  });
}

export const authService = {
  async getSession(): Promise<AuthSession | null> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return data.session?.user ? { user: publicUser(data.session.user) } : null;
  },

  async getAccessToken(): Promise<string | null> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return data.session?.access_token ?? null;
  },

  async signUp(input: SignupInput): Promise<AuthSession> {
    const email = normalizeEmail(input.email);
    const password = input.password.trim();
    const name = input.name.trim() || "ContentKing Creator";

    if (!email || !password) {
      throw new Error("Enter an email and password to create your account.");
    }

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Supabase did not return a signed-up user.");
    }

    if (data.session) {
      await ensureProfile(data.user, name);
    }

    return { user: publicUser(data.user, name) };
  },

  async prepareSignUp(input: SignupInput) {
    const email = normalizeEmail(input.email);
    const password = input.password.trim();
    const name = input.name.trim() || "ContentKing Creator";

    if (!email || !password) {
      throw new Error("Enter an email and password to create your account.");
    }

    writeJson(PENDING_SIGNUP_KEY, { name, email, password });
  },

  async completePendingSignUp(): Promise<AuthSession | null> {
    const pendingSignup = readJson<SignupInput | null>(PENDING_SIGNUP_KEY, null);

    if (!pendingSignup) {
      return null;
    }

    const session = await this.signUp(pendingSignup);
    removeStorage(PENDING_SIGNUP_KEY);
    return session;
  },

  clearPendingSignUp() {
    removeStorage(PENDING_SIGNUP_KEY);
  },

  async signIn(input: AuthCredentials): Promise<AuthSession> {
    const email = normalizeEmail(input.email);
    const password = input.password.trim();

    if (!email || !password) {
      throw new Error("Enter your email and password.");
    }

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("No matching account was found.");
    }

    const existingProfile = await profileService.getProfile(data.user.id);

    if (!existingProfile) {
      await ensureProfile(data.user, nameFromUser(data.user));
    }

    return { user: publicUser(data.user) };
  },

  async signOut() {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },

  async listUsers(): Promise<UserRecord[]> {
    const accessToken = await this.getAccessToken();

    if (!accessToken) {
      return [];
    }

    const profiles = await profileService.listProfiles(accessToken);
    return profiles.map((profile) => ({
      id: profile.id,
      name: profile.fullName || profile.email,
      email: profile.email,
      role:
        process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase() === profile.email.toLowerCase()
          ? "admin"
          : "user",
      createdAt: profile.createdAt,
      lastLoginAt: profile.createdAt
    }));
  }
};
