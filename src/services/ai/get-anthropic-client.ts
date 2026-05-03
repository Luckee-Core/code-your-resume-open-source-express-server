import Anthropic from "@anthropic-ai/sdk";

let cached: Anthropic | null | undefined;

/**
 * Returns a lazy singleton Anthropic client, or null if ANTHROPIC_API_KEY is not set.
 * Call once at handler time; safe to call repeatedly.
 */
export const getAnthropicClient = (): Anthropic | null => {
  if (cached !== undefined) return cached;
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  cached = key ? new Anthropic({ apiKey: key }) : null;
  return cached;
};
