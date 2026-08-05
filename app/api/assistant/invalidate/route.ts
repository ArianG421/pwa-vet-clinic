import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { invalidateAssistantIndex } from "@/lib/data/assistant-index";

// Called by hooks/use-crm-pricing.ts after a successful price update — the
// assistant index cache (lib/data/assistant-index.ts) is a module-level
// in-memory Map, only reachable from server code, so a client hook can't
// clear it directly. Staff-only, re-checked server-side rather than relying
// on proxy.ts alone, same pattern as /api/crm/send-email.
export async function POST() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "This demo's backend isn't connected yet." }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "staff") {
    return NextResponse.json({ error: "Staff access required." }, { status: 403 });
  }

  invalidateAssistantIndex();
  return NextResponse.json({ ok: true });
}
