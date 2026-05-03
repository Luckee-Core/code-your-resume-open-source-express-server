import Anthropic from "@anthropic-ai/sdk";
import { getModelConfig } from "../ai/model-config";
import { fetchJobListingDocument } from "../job/fetch-job-listing-document";
import { htmlJobListingToPlainText } from "../job/html-job-listing-to-plain-text";
import { validatePublicJobListingUrl } from "../job/validate-public-job-listing-url";
import { getCompanyFromStore, updateCompanyInStore } from "../../data/crm/read-write-companies";
import type { Company } from "../../data/crm/types";

const WEBSITE_MODEL = getModelConfig("website_business_overview");
const MAX_URLS = 3;
const MAX_PLAIN_TOTAL = 120_000;
const MAX_SUMMARY_CHARS = 12_000;
const FALLBACK_EXCERPT_CHARS = 4_000;

type PagePlain = { href: string; plain: string };

const toFetchableUrl = (raw: string): string | null => {
  const t = raw.trim();
  if (!t) return null;
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  const v = validatePublicJobListingUrl(withProto);
  return v.ok ? v.href : null;
};

const buildResearchUrls = (company: Company): string[] => {
  const out: string[] = [];
  const push = (href: string | null) => {
    if (!href || out.includes(href)) return;
    out.push(href);
  };
  push(toFetchableUrl(company.website));
  for (const u of company.websiteUrls ?? []) {
    push(toFetchableUrl(u));
    if (out.length >= MAX_URLS) break;
  }
  return out.slice(0, MAX_URLS);
};

/**
 * When Anthropic is unavailable or fails, store a short notice plus one homepage-style excerpt
 * (not the full multi-URL dump with `--- url ---` markers).
 */
const buildFallbackSummary = (reason: "missing_api_key" | "ai_error", pages: PagePlain[]): string => {
  const excerptSource =
    pages.map((p) => p.plain.trim()).find((t) => t.length > 0) ?? "";
  const excerpt =
    excerptSource.length > FALLBACK_EXCERPT_CHARS
      ? `${excerptSource.slice(0, FALLBACK_EXCERPT_CHARS)}…`
      : excerptSource;
  const why =
    reason === "missing_api_key"
      ? "AI summary skipped: ANTHROPIC_API_KEY is not set on the CRM Express server. Below is a short excerpt from the first page we could read."
      : "AI summary failed (network or API error). Below is a short excerpt from the first page we could read.";
  const body = excerpt.trim() ? excerpt : "(No readable text extracted.)";
  const combined = `${why}\n\n${body}`;
  return combined.length > MAX_SUMMARY_CHARS ? combined.slice(0, MAX_SUMMARY_CHARS) : combined;
};

const summarizePlainText = async (
  companyName: string,
  combinedForAi: string,
  pages: PagePlain[],
): Promise<string> => {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    console.log("⚠️ Website research: no ANTHROPIC_API_KEY — storing excerpt-only fallback");
    return buildFallbackSummary("missing_api_key", pages);
  }
  try {
    console.log("🤖 Website research: calling Anthropic for summary");
    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: WEBSITE_MODEL.model,
      max_tokens: WEBSITE_MODEL.maxTokens,
      temperature: WEBSITE_MODEL.temperature,
      system:
        "Write a concise CRM summary in plain text (no markdown) based only on the website excerpts. Use 3–8 short paragraphs. Describe what the company offers and who it serves when the text supports it.",
      messages: [
        {
          role: "user",
          content: `Company name: ${companyName}\n\nWebsite text:\n${combinedForAi.slice(0, 100_000)}`,
        },
      ],
    });
    const block = msg.content.find((b: { type: string }) => b.type === "text");
    const text = block && block.type === "text" ? block.text.trim() : "";
    if (!text) {
      console.log("⚠️ Website research: empty model text — using excerpt fallback");
      return buildFallbackSummary("ai_error", pages);
    }
    const out = text.length > MAX_SUMMARY_CHARS ? text.slice(0, MAX_SUMMARY_CHARS) : text;
    console.log("✅ Website research: Anthropic summary received");
    return out;
  } catch (err) {
    console.error("❌ Website research: Anthropic error", err);
    return buildFallbackSummary("ai_error", pages);
  }
};

export type RunCompanyWebsiteResearchResult =
  | { ok: true; company: Company }
  | { ok: false; code: "not_found" | "no_website" | "no_content"; message: string };

/**
 * Fetches up to three company-related URLs, converts HTML to text, optional Anthropic summary, stores on company.
 */
export const runCompanyWebsiteResearch = async (
  companyId: string,
): Promise<RunCompanyWebsiteResearchResult> => {
  console.log("🚀 Website research: start", { companyId });
  const company = await getCompanyFromStore(companyId);
  if (!company) {
    return { ok: false, code: "not_found", message: "Company not found" };
  }

  const urls = buildResearchUrls(company);
  if (urls.length === 0) {
    return {
      ok: false,
      code: "no_website",
      message: "Set a website on this company (or add URLs from site discovery) before running research",
    };
  }

  console.log("📥 Website research: URLs", { count: urls.length, urls });

  const pages: PagePlain[] = [];
  const chunks: string[] = [];
  let total = 0;
  for (const href of urls) {
    const fetched = await fetchJobListingDocument(href);
    if (!fetched.ok) {
      console.log("⚠️ Website research: fetch failed", { href, httpStatus: fetched.httpStatus });
      continue;
    }
    const plain = htmlJobListingToPlainText(fetched.bodyText);
    if (!plain.trim()) {
      console.log("⚠️ Website research: no plain text", { href });
      continue;
    }
    pages.push({ href, plain });
    const piece = `\n\n--- ${href} ---\n\n${plain}`;
    if (total + piece.length > MAX_PLAIN_TOTAL) {
      chunks.push(piece.slice(0, MAX_PLAIN_TOTAL - total));
      break;
    }
    chunks.push(piece);
    total += piece.length;
  }

  const combinedForAi = chunks.join("").trim();
  if (!combinedForAi) {
    return {
      ok: false,
      code: "no_content",
      message: "Could not extract readable text from the configured URLs",
    };
  }

  const summary = await summarizePlainText(
    company.name.trim() || "Company",
    combinedForAi,
    pages,
  );
  const now = new Date().toISOString();
  const next = await updateCompanyInStore(companyId, {
    websiteResearchSummary: summary,
    websiteResearchCompletedAt: now,
  });
  if (!next) {
    return { ok: false, code: "not_found", message: "Company not found after update" };
  }
  console.log("✅ Website research: saved", { companyId, summaryChars: summary.length });
  return { ok: true, company: next };
};
