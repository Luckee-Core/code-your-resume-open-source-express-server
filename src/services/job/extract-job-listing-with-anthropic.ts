import Anthropic from "@anthropic-ai/sdk";
import { getModelConfig } from "../ai/model-config";
import type { ExtractJobListingHints } from "./extract-job-listing-types";

const JOB_LISTING_MODEL = getModelConfig("job_listing");

const MAX_BULLETS_PER_SECTION = 80;
const MAX_BULLET_CHARS = 2000;

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const t = item.trim();
    if (!t) continue;
    out.push(t.length > MAX_BULLET_CHARS ? t.slice(0, MAX_BULLET_CHARS) : t);
    if (out.length >= MAX_BULLETS_PER_SECTION) break;
  }
  return out;
};

export type ExtractJobListingOutcome =
  | { kind: "skipped" }
  | {
      kind: "ok";
      title: string | null;
      description: string;
      responsibilities: string[];
      requirements: string[];
      niceToHaves: string[];
      rawResponse: string;
      usageInputTokens: number | null;
      usageOutputTokens: number | null;
      systemPrompt: string;
      userMessage: string;
    }
  | {
      kind: "error";
      message: string;
      rawResponse: string;
      systemPrompt: string;
      userMessage: string;
    };

/**
 * Single Anthropic call that extracts title, description, responsibilities,
 * requirements, and nice-to-haves from job listing plain text in one JSON response.
 * Returns `{ kind: "skipped" }` when `ANTHROPIC_API_KEY` is unset.
 */
export const extractJobListingWithAnthropic = async (
  plainText: string,
  hints: ExtractJobListingHints,
  options: { systemPrompt: string },
): Promise<ExtractJobListingOutcome> => {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    return { kind: "skipped" };
  }

  const systemPrompt = options.systemPrompt.trim();
  if (!systemPrompt) {
    return { kind: "error", message: "Missing job listing system prompt", rawResponse: "", systemPrompt: "", userMessage: "" };
  }

  const userMessage = [
    hints.companyName ? `Company context: ${hints.companyName}` : "",
    hints.titleHint ? `Existing title hint: ${hints.titleHint}` : "",
    "Job posting plain text follows:\n---\n",
    plainText,
  ]
    .filter(Boolean)
    .join("\n");

  const userMessageSent = userMessage.slice(0, 100_000);
  const client = new Anthropic({ apiKey: key });

  console.log("📥 job-listing extract: sending to Anthropic", {
    model: JOB_LISTING_MODEL.model,
    plainTextChars: plainText.length,
    hasCompanyHint: Boolean(hints.companyName?.trim()),
    hasTitleHint: Boolean(hints.titleHint?.trim()),
  });

  try {
    const msg = await client.messages.create({
      model: JOB_LISTING_MODEL.model,
      max_tokens: JOB_LISTING_MODEL.maxTokens,
      temperature: JOB_LISTING_MODEL.temperature,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessageSent }],
    });

    const block = msg.content.find((b: { type: string }) => b.type === "text");
    const rawResponse =
      block && block.type === "text" ? block.text.trim() : "";

    console.log("📤 job-listing extract: Anthropic message received", {
      model: JOB_LISTING_MODEL.model,
      contentBlockTypes: msg.content.map((b) => b.type),
      rawChars: rawResponse.length,
      usageInputTokens: msg.usage?.input_tokens ?? null,
      usageOutputTokens: msg.usage?.output_tokens ?? null,
    });

    const usageInputTokens =
      typeof msg.usage?.input_tokens === "number" ? msg.usage.input_tokens : null;
    const usageOutputTokens =
      typeof msg.usage?.output_tokens === "number" ? msg.usage.output_tokens : null;

    let title: string | null = null;
    let description = "";
    let responsibilities: string[] = [];
    let requirements: string[] = [];
    let niceToHaves: string[] = [];

    try {
      const strip = rawResponse.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      const parsed = JSON.parse(strip) as Record<string, unknown>;

      if (typeof parsed.title === "string" && parsed.title.trim()) {
        title = parsed.title.trim();
      } else if (parsed.title === null) {
        title = null;
      }
      if (typeof parsed.description === "string") {
        description = parsed.description.trim();
      }
      responsibilities = normalizeStringArray(parsed.responsibilities);
      requirements = normalizeStringArray(parsed.requirements);
      niceToHaves = normalizeStringArray(parsed.niceToHaves);

      console.log("✅ job-listing extract: JSON parsed", {
        title: title ?? null,
        hasTitleString: Boolean(title),
        descriptionChars: description.length,
        responsibilities: responsibilities.length,
        requirements: requirements.length,
        niceToHaves: niceToHaves.length,
        rawResponseChars: rawResponse.length,
      });
    } catch (parseErr) {
      description = rawResponse.slice(0, 50_000);
      console.warn("⚠️ job-listing extract: JSON.parse failed, using raw response as description", {
        rawResponseChars: rawResponse.length,
        error: parseErr instanceof Error ? parseErr.message : String(parseErr),
      });
    }

    return {
      kind: "ok",
      title,
      description: description || rawResponse.slice(0, 50_000),
      responsibilities,
      requirements,
      niceToHaves,
      rawResponse,
      usageInputTokens,
      usageOutputTokens,
      systemPrompt,
      userMessage: userMessageSent,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Anthropic request failed";
    return {
      kind: "error",
      message,
      rawResponse: "",
      systemPrompt,
      userMessage: userMessageSent,
    };
  }
};

export const getAnthropicJobListingModel = (): string => JOB_LISTING_MODEL.model;
