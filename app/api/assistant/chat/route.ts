import { NextResponse } from "next/server";
import { z } from "zod";
import { getAssistantIndex, type AssistantIndexEntry } from "@/lib/data/assistant-index";
import { site } from "@/lib/site";

const chatSchema = z.object({
  locale: z.enum(["en", "sv"]),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .min(1)
    .max(12),
});

// Keep the sent history short — bounds both token cost and abuse, and a
// site-navigation assistant never needs deep context anyway.
const MAX_HISTORY = 8;

const MODEL = "claude-haiku-4-5-20251001";

function buildSystemPrompt(locale: "en" | "sv", index: AssistantIndexEntry[]) {
  const languageName = locale === "sv" ? "Swedish" : "English";
  const reference = index.map((e) => `- ${e.title}: ${e.description} (path: ${e.path})`).join("\n");

  return `You are the website assistant for ${site.name}, a veterinary clinic. Your only job is to help visitors find the right page on this site and answer short factual questions about the clinic — services, pricing, hours, booking, staff — using ONLY the reference data below. Never invent a price, an hour, a service, or a policy that isn't in the reference data.

You are NOT a veterinarian. If asked to diagnose a pet, assess a symptom, or give medical/treatment advice, politely decline and suggest booking an appointment or calling the clinic at ${site.phone}. Do not speculate about medical severity even if the reference data mentions a symptom in an FAQ answer — you may repeat that FAQ answer, but do not go further than what it says.

Reply in ${languageName}. Keep answers under about 80 words. Plain prose only — no markdown (no asterisks, no bullet points, no headings), since your reply is shown as-is in a plain-text chat bubble.

When there is one clear page the visitor should go to next, call the "navigate" tool with that page's exact path and a short human-readable label for the button — in addition to your short text answer, not instead of it. Only call it with a path that appears in the reference data below. If no single page clearly fits, don't call it.

Reference data:
${reference}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY isn't configured yet.", configured: false }, { status: 503 });
  }

  const { locale, messages } = parsed.data;
  const index = await getAssistantIndex(locale);
  const validPaths = Array.from(new Set(index.map((e) => e.path)));

  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      system: buildSystemPrompt(locale, index),
      messages: messages.slice(-MAX_HISTORY).map((m) => ({ role: m.role, content: m.content })),
      tools: [
        {
          name: "navigate",
          description: "Suggest the single best page on the site for the visitor to go to next.",
          input_schema: {
            type: "object",
            properties: {
              path: { type: "string", enum: validPaths },
              label: { type: "string", description: "Short button label, e.g. 'Pricing' or 'Book a visit'." },
            },
            required: ["path", "label"],
          },
        },
      ],
    }),
  });

  const result = await anthropicResponse.json().catch(() => ({}));

  if (!anthropicResponse.ok) {
    const message: string = result?.error?.message ?? `Assistant request failed (${anthropicResponse.status}).`;
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const content: Array<{ type: string; text?: string; input?: { path?: string; label?: string } }> = result.content ?? [];
  const reply = content
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n")
    .trim();
  const toolUse = content.find((block) => block.type === "tool_use" && block.input?.path && block.input?.label);
  const suggestion = toolUse ? { path: toolUse.input!.path as string, label: toolUse.input!.label as string } : null;

  return NextResponse.json({ reply, suggestion });
}
