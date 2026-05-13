import { NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseAuthClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function adminProfileError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return adminProfileError("Supabase admin is not configured. Add SUPABASE_SERVICE_ROLE_KEY.", 503);
  }

  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  if (!accessToken) {
    return adminProfileError("Admin profiles require a signed-in Supabase session.", 401);
  }

  try {
    const authClient = getSupabaseAuthClient();
    const {
      data: { user },
      error: authError
    } = await authClient.auth.getUser(accessToken);

    if (authError || !user) {
      return adminProfileError("Invalid Supabase session.", 401);
    }

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "").trim().toLowerCase();

    if (adminEmail && user.email?.toLowerCase() !== adminEmail) {
      return adminProfileError("This account is not allowed to view customer profiles.", 403);
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,plan,subscription_status,text_generation_limit,text_generations_used,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase admin profile list failed", error);
      return adminProfileError("Unable to load customer profiles from Supabase.", 500);
    }

    return NextResponse.json({ profiles: data ?? [] });
  } catch (error) {
    console.warn("Admin profile API failed", error);
    return adminProfileError("Unable to load customer profiles.", 500);
  }
}
