import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const sendEmailSchema = z.object({
  to: z.string().trim().email(),
  toName: z.string().trim().max(200).optional().nullable(),
  subject: z.string().trim().min(1).max(300),
  body: z.string().trim().min(1).max(10000),
  profileId: z.string().uuid().optional().nullable(),
  contactMessageId: z.string().uuid().optional().nullable(),
});

// Sandbox default — Resend only lets an unverified domain send from this
// address, and only deliver to the account's own email. Once a real domain
// is verified in Resend, set RESEND_FROM_EMAIL to override.
const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "Öresunds Vet <onboarding@resend.dev>";

export async function POST(request: Request) {
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

  // Re-check staff status server-side rather than trusting the client —
  // this is a mutating, external-facing action, proxy.ts gating the page
  // isn't enough on its own.
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "staff") {
    return NextResponse.json({ error: "Staff access required." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sendEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { to, toName, subject, body: emailBody, profileId, contactMessageId } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY isn't configured yet." }, { status: 503 });
  }

  const logRow = {
    profile_id: profileId ?? null,
    contact_message_id: contactMessageId ?? null,
    to_email: to,
    to_name: toName ?? null,
    subject,
    body: emailBody,
    staff_id: user.id,
  };

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: toName ? `${toName} <${to}>` : to,
      subject,
      text: emailBody,
    }),
  });

  const resendResult = await resendResponse.json().catch(() => ({}));

  if (!resendResponse.ok) {
    // Surface Resend's actual error text (e.g. its sandbox-domain
    // recipient restriction) instead of a generic failure message, so
    // staff can tell a real delivery problem from an expected demo limit.
    const message: string = resendResult?.message ?? `Resend request failed (${resendResponse.status}).`;
    await supabase.from("crm_emails").insert({ ...logRow, status: "failed", error_message: message });
    return NextResponse.json({ error: message }, { status: 502 });
  }

  await supabase.from("crm_emails").insert({ ...logRow, status: "sent" });
  return NextResponse.json({ ok: true });
}
