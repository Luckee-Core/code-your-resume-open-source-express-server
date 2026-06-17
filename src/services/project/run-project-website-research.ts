import Anthropic from "@anthropic-ai/sdk";
import { getModelConfig } from "../ai/model-config";
import { requireCrmSupabaseClient } from "../../data/crm/require-crm-supabase-client";
import { getProjectById } from "../../data/projects/get-by-id";
import { updateProject } from "../../data/projects/update";
import type { Project } from "../../data/projects/types";
import { fetchJobListingDocument } from "../job/fetch-job-listing-document";
import { htmlJobListingToPlainText } from "../job/html-job-listing-to-plain-text";
import { validatePublicJobListingUrl } from "../job/validate-public-job-listing-url";

const WEBSITE_MODEL = getModelConfig("website_business_overview");
const MAX_PLAIN_TOTAL = 120_000;
const MAX_SUMMARY_CHARS = 12_000;
const FALLBACK_EXCERPT_CHARS = 4_000;

const toFetchableUrl = (raw: string): string | null => {
  const t = raw.trim();
  if (!t) return null;
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  const v = validatePublicJobListingUrl(withProto);
  return v.ok ? v.href : null;
};

/**
 * When Anthropic is unavailable or fails, store a short notice plus one page excerpt.
 */
const buildFallbackSummary = (reason: "missing_api_key" | "ai_error", plain: string): string => {
  const excerptSource = plain.trim();
  const excerpt =
    excerptSource.length > FALLBACK_EXCERPT_CHARS
      ? `${excerptSource.slice(0, FALLBACK_EXCERPT_CHARS)}…`
      : excerptSource;
  const why =
    reason === "missing_api_key"
      ? "AI summary skipped: ANTHROPIC_API_KEY is not set on the CRM Express server. Below is a short excerpt from the page we could read."
      : "AI summary failed (network or API error). Below is a short excerpt from the page we could read.";
  const body = excerpt.trim() ? excerpt : "(No readable text extracted.)";
  const combined = `${why}\n\n${body}`;
  return combined.length > MAX_SUMMARY_CHARS ? combined.slice(0, MAX_SUMMARY_CHARS) : combined;
};

const summarizePlainText = async (
  businessName: string,
  combinedForAi: string,
  plainForFallback: string,
): Promise<string> => {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    console.log("⚠️ Project website research: no ANTHROPIC_API_KEY — storing excerpt-only fallback");
    return buildFallbackSummary("missing_api_key", plainForFallback);
  }
  try {
    console.log("🤖 Project website research: calling Anthropic for summary");
    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: WEBSITE_MODEL.model,
      max_tokens: WEBSITE_MODEL.maxTokens,
      temperature: WEBSITE_MODEL.temperature,
      system:
        "Write a concise summary in plain text (no markdown) based only on the website excerpt. Use 3–8 short paragraphs. Describe what this project or business offers, who it serves, and notable technical or product details when the text supports it.",
      messages: [
        {
          role: "user",
          content: `Project / business name: ${businessName}\n\nWebsite text:\n${combinedForAi.slice(0, 100_000)}`,
        },
      ],
    });
    const block = msg.content.find((b: { type: string }) => b.type === "text");
    const text = block && block.type === "text" ? block.text.trim() : "";
    if (!text) {
      console.log("⚠️ Project website research: empty model text — using excerpt fallback");
      return buildFallbackSummary("ai_error", plainForFallback);
    }
    const out = text.length > MAX_SUMMARY_CHARS ? text.slice(0, MAX_SUMMARY_CHARS) : text;
    console.log("✅ Project website research: Anthropic summary received");
    return out;
  } catch (err) {
    console.error("❌ Project website research: Anthropic error", err);
    return buildFallbackSummary("ai_error", plainForFallback);
  }
};

export type RunProjectWebsiteResearchResult =
  | { ok: true; project: Project }
  | { ok: false; code: "not_found" | "no_website" | "no_content"; message: string };

/**
 * Fetches the project URL, converts HTML to text, optional Anthropic summary, stores on project.
 */
export const runProjectWebsiteResearch = async (
  projectId: string,
): Promise<RunProjectWebsiteResearchResult> => {
  console.log("🚀 Project website research: start", { projectId });
  const supabase = requireCrmSupabaseClient();

  const project = await getProjectById(supabase, projectId);
  if (!project) {
    return { ok: false, code: "not_found", message: "Project not found" };
  }

  const href = toFetchableUrl(project.url);
  if (!href) {
    return {
      ok: false,
      code: "no_website",
      message: "Set a project URL before running website research",
    };
  }

  console.log("📥 Project website research: fetching", { projectId, href });

  const fetched = await fetchJobListingDocument(href);
  if (!fetched.ok) {
    console.log("⚠️ Project website research: fetch failed", {
      href,
      httpStatus: fetched.httpStatus,
    });
    return {
      ok: false,
      code: "no_content",
      message: "Could not fetch the project URL",
    };
  }

  const plain = htmlJobListingToPlainText(fetched.bodyText);
  const combinedForAi = plain.trim().slice(0, MAX_PLAIN_TOTAL);
  if (!combinedForAi) {
    return {
      ok: false,
      code: "no_content",
      message: "Could not extract readable text from the project URL",
    };
  }

  const summary = await summarizePlainText(
    project.businessName.trim() || "Project",
    combinedForAi,
    plain,
  );
  const now = new Date().toISOString();

  const next = await updateProject(supabase, projectId, {
    websiteResearchSummary: summary,
    websiteResearchCompletedAt: now,
  });

  console.log("✅ Project website research: saved", {
    projectId,
    summaryChars: summary.length,
  });
  return { ok: true, project: next };
};
