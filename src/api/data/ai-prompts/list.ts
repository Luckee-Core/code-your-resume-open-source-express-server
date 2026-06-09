import type { Request, Response } from 'express';
import { requireCrmSupabaseClient } from '../../../data/crm/require-crm-supabase-client';
import { CRM_AI_FLOW_PROMPT_FLOW_LABELS } from '../../../constants/crm-ai-flow-prompt-flows';
import { listCrmAiFlowPrompts } from '../../../data/crm-ai-flow-prompt';
import { listJobListingAiPrompts } from '../../../data/job-listing-ai-prompt';
import { listJobNewsletterIngestAiPrompts } from '../../../data/job-newsletter-ingest-ai-prompt';

/**
 * GET /api/data/ai-prompts/list — all versioned AI prompts across flows.
 */
export const handleAiPromptsList = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/ai-prompts/list');
  try {
    const supabase = requireCrmSupabaseClient();

    const [newsletterPrompts, listingPrompts, flowPrompts] = await Promise.all([
      listJobNewsletterIngestAiPrompts(supabase),
      listJobListingAiPrompts(supabase),
      listCrmAiFlowPrompts(supabase),
    ]);

    const warnings: string[] = [];
    if (newsletterPrompts.length === 0 && listingPrompts.length === 0 && flowPrompts.length === 0) {
      warnings.push(
        'No AI prompt tables found. Run docs/supabase-crm-ai-prompts-migration.sql in Supabase SQL editor.',
      );
    }

    const data = [
      ...newsletterPrompts.map((row) => ({
        id: row.id,
        flow: 'job_newsletter_ingest' as const,
        flowLabel: 'Job newsletter ingest',
        name: row.name,
        version: row.version,
        systemPrompt: row.system_prompt,
        isActive: row.is_active,
        createdAt: row.created_at,
      })),
      ...listingPrompts.map((row) => ({
        id: row.id,
        flow: 'job_listing' as const,
        flowLabel: 'Job listing import',
        name: row.name,
        version: row.version,
        systemPrompt: row.system_prompt,
        isActive: row.is_active,
        createdAt: row.created_at,
      })),
      ...flowPrompts.map((row) => ({
        id: row.id,
        flow: row.flow,
        flowLabel: CRM_AI_FLOW_PROMPT_FLOW_LABELS[row.flow] ?? row.flow,
        name: row.name,
        version: row.version,
        systemPrompt: row.system_prompt,
        isActive: row.is_active,
        createdAt: row.created_at,
      })),
    ];

    console.log('📤 200 GET /api/data/ai-prompts/list');
    res.status(200).json({ success: true, data, warnings: warnings.length > 0 ? warnings : undefined });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to list AI prompts';
    console.error('❌ handleAiPromptsList:', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
