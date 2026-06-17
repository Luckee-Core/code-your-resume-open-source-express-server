/**
 * AI model settings for CRM Express Anthropic calls.
 * Haiku id matches mentorai-server `src/services/ai/model-config.ts`.
 *
 * @see https://docs.anthropic.com/en/docs/build-with-claude/models
 */

export type ModelConfig = {
  model: string;
  temperature: number;
  maxTokens: number;
};

const HAIKU = "claude-haiku-4-5-20251001";

const CONFIGS: Record<string, ModelConfig> = {
  /** Crawled website plain text → CRM company summary (plain prose). */
  website_business_overview: {
    model: HAIKU,
    temperature: 0.25,
    maxTokens: 8192,
  },
  /** Job listing page text → combined JSON: title, description, responsibilities, requirements, nice-to-haves. */
  job_listing: {
    model: HAIKU,
    temperature: 0.2,
    maxTokens: 8192,
  },
  /** User Background Studio coach — experience Q&A and segment item suggestions. */
  user_background_studio: {
    model: HAIKU,
    temperature: 0.3,
    maxTokens: 8192,
  },
  /** Technical Skills Studio coach — skill list chat + suggestions. */
  technical_skills: {
    model: HAIKU,
    temperature: 0.25,
    maxTokens: 8192,
  },
  /** Job Studio coach — per-job career chat (no CRM mutations). */
  job_studio: {
    model: HAIKU,
    temperature: 0.28,
    maxTokens: 8192,
  },
  /** Job newsletter email → structured job posting rows for CRM ingest. */
  job_newsletter_ingest: {
    model: HAIKU,
    temperature: 0.2,
    maxTokens: 8192,
  },
  /** Pasted project narrative → resume-ready project note bullets. */
  project_notes_synthesis: {
    model: HAIKU,
    temperature: 0.2,
    maxTokens: 8192,
  },
};

/**
 * @param messageType - Key in {@link CONFIGS} (e.g. `website_business_overview`).
 */
export const getModelConfig = (messageType: string): ModelConfig => {
  const config = CONFIGS[messageType];
  if (!config) {
    throw new Error(`Unknown message type: ${messageType}`);
  }
  return config;
};
