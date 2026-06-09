import type { Request, Response } from 'express';
import { requireCrmSupabaseClient } from '../../../data/crm/require-crm-supabase-client';
import { listJobListingAiPrompts } from '../../../data/job-listing-ai-prompt';

/**
 * GET /api/data/job-listing-ai-prompts/list
 */
export const handleJobListingAiPromptsList = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/job-listing-ai-prompts/list');
  try {
    const rows = await listJobListingAiPrompts(requireCrmSupabaseClient());
    const data = rows.map((row) => ({
      id: row.id,
      name: row.name,
      version: row.version,
      systemPrompt: row.system_prompt,
      isActive: row.is_active,
      createdAt: row.created_at,
    }));

    console.log('📤 200 GET /api/data/job-listing-ai-prompts/list');
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to list job listing AI prompts';
    console.error('❌ handleJobListingAiPromptsList:', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
