import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // TODO(stage 3): write to Supabase `contact_messages` once the project is wired up.
  console.log("[contact]", parsed.data);

  return NextResponse.json({ ok: true });
}
