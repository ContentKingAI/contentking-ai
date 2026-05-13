import { NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseAuthClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase admin is not configured. Add SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  if (!accessToken) {
    return NextResponse.json({ error: "Admin profiles require a signed-in Supabase session." }, { status: 401 });
  }

  const authClient = getSupabaseAuthClient();
  const {
    data: { user },
    error: authError
  } = await authClient.auth.getUser(accessToken);

  if (authError || !user) {
    return NextResponse.json({ error: "Invalid Supabase session." }, { status: 401 });
  }

  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "").trim().toLowerCase();

  if (adminEmail && user.email?.toLowerCase() !== adminEmail) {
    return NextResponse.json({ error: "This account is not allowed to view customer profiles." }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,plan,subscription_status,text_generation_limit,text_generations_used,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profiles: data ?? [] });
}
