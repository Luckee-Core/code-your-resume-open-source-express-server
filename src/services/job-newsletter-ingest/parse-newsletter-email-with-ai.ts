import Anthropic from '@anthropic-ai/sdk';
import { getModelConfig } from '../ai/model-config';
import type { ParsedNewsletterJobListing } from './types';

const MODEL = getModelConfig('job_newsletter_ingest');

const SYSTEM_PROMPT =
  'You extract structured job postings from newsletter emails. Reply with ONLY valid JSON (no markdown fences) shaped as: {"jobs":[{"title":string,"companyName":string,"url":string,"description":string,"salary":string|null}]}. Include every distinct job posting found. Use empty string for missing text fields and null for salary when unknown. url must be the application or listing link when present in the email.';

const MAX_FIELD_CHARS = 8000;
const MAX_JOBS = 100;

const trimField = (value: unknown, max = MAX_FIELD_CHARS): string => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
};

const normalizeJobs = (value: unknown): ParsedNewsletterJobListing[] => {
  if (!Array.isArray(value)) return [];
  const out: ParsedNewsletterJobListing[] = [];

  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const title = trimField(row.title);
    const companyName = trimField(row.companyName);
    const url = trimField(row.url, 2000);
    const description = trimField(row.description, 50_000);
    const salaryRaw = row.salary;
    const salary =
      typeof salaryRaw === 'string' && salaryRaw.trim() ? salaryRaw.trim() : null;

    if (!title && !companyName && !url) continue;

    out.push({ title, companyName, url, description, salary });
    if (out.length >= MAX_JOBS) break;
  }

  return out;
};

export type ParseNewsletterEmailWithAiInput = {
  sourceName: string;
  parseInstructions: string;
  subject?: string | null;
  bodyHtml?: string | null;
  bodyText?: string | null;
};

export type ParseNewsletterEmailWithAiOutcome =
  | { kind: 'skipped'; reason: 'no_api_key' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ok';
      jobs: ParsedNewsletterJobListing[];
      parseSource: 'html' | 'text';
      rawResponse: string;
    };

/**
 * Use Anthropic to extract job postings from a newsletter email using per-source instructions.
 */
export const parseNewsletterEmailWithAi = async (
  input: ParseNewsletterEmailWithAiInput,
): Promise<ParseNewsletterEmailWithAiOutcome> => {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    return { kind: 'skipped', reason: 'no_api_key' };
  }

  const html = input.bodyHtml?.trim() ?? '';
  const text = input.bodyText?.trim() ?? '';
  const content = html || text;
  if (!content) {
    return { kind: 'ok', jobs: [], parseSource: html ? 'html' : 'text', rawResponse: '' };
  }

  const parseSource: 'html' | 'text' = html ? 'html' : 'text';
  const userMessage = [
    `Newsletter source: ${input.sourceName}`,
    input.subject ? `Subject: ${input.subject}` : '',
    'Parse instructions from configuration:',
    input.parseInstructions,
    '',
    `Email body (${parseSource}):`,
    '---',
    content.slice(0, 120_000),
  ]
    .filter(Boolean)
    .join('\n');

  const client = new Anthropic({ apiKey: key });

  try {
    console.log('🤖 parseNewsletterEmailWithAi', {
      sourceName: input.sourceName,
      parseSource,
      contentChars: content.length,
    });

    const msg = await client.messages.create({
      model: MODEL.model,
      max_tokens: MODEL.maxTokens,
      temperature: MODEL.temperature,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const block = msg.content.find((b) => b.type === 'text');
    const rawResponse = block && block.type === 'text' ? block.text.trim() : '';

    const strip = rawResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const parsed = JSON.parse(strip) as Record<string, unknown>;
    const jobs = normalizeJobs(parsed.jobs);

    console.log('✅ parseNewsletterEmailWithAi', { jobsFound: jobs.length });
    return { kind: 'ok', jobs, parseSource, rawResponse };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Anthropic parse failed';
    console.error('❌ parseNewsletterEmailWithAi:', message);
    return { kind: 'error', message };
  }
};
