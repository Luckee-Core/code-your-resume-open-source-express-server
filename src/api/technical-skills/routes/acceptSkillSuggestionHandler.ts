import { Request, Response } from 'express';
import { getManagedPgPool } from '../../../services/postgres';
import {
  getTechnicalSkillSuggestion,
  acceptTechnicalSkillSuggestion,
} from '../../../data/technical-skills';
import { loadTechnicalSkillsPayload } from '../loadTechnicalSkillsPayload';

/**
 * POST /api/technical-skills/suggestions/:suggestionId/accept
 */
export const acceptSkillSuggestionHandler = async (req: Request, res: Response) => {
  try {
    const { suggestionId } = req.params as Record<string, string>;
    if (!suggestionId) {
      return res.status(400).json({ success: false, error: 'suggestionId is required' });
    }

    const pool = getManagedPgPool();
    if (!pool) {
      return res.status(500).json({ success: false, error: 'Postgres not configured — set DATABASE_URL' });
    }

    const suggestion = await getTechnicalSkillSuggestion(pool, suggestionId);
    if (!suggestion) {
      return res.status(404).json({ success: false, error: 'Suggestion not found' });
    }
    if (suggestion.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Suggestion is not pending' });
    }

    const op = suggestion.op === 'update' ? 'update' : 'add';
    if (op === 'update' && !suggestion.target_skill_id) {
      return res.status(400).json({ success: false, error: 'Update suggestion missing target skill' });
    }

    await acceptTechnicalSkillSuggestion(pool, {
      suggestionId: suggestion.id,
      title: suggestion.title,
      body: suggestion.body,
      op,
      targetSkillId: suggestion.target_skill_id,
      exchangeId: suggestion.exchange_id,
    });

    const payload = await loadTechnicalSkillsPayload(pool);
    return res.json({ success: true, ...payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ acceptSkillSuggestionHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
