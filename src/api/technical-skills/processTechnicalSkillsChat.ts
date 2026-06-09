import Anthropic from '@anthropic-ai/sdk';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import {
  listTechnicalSkills,
  listTechnicalSkillsExchanges,
  listTechnicalSkillsRequestsByIds,
  listTechnicalSkillsResponsesByIds,
  insertTechnicalSkillsRequest,
  insertTechnicalSkillsResponse,
  insertTechnicalSkillsExchange,
  updateTechnicalSkillsRequestCompletion,
  insertTechnicalSkillsSuggestionsBulk,
} from '../../data/technical-skills';
import { callAI } from './call-ai';
import { CRM_AI_FLOW_PROMPT_FLOWS } from '../../constants/crm-ai-flow-prompt-flows';
import { loadCrmCoachSystemPrompt } from '../../utils/ai/load-crm-coach-system-prompt';
import { buildTechnicalSkillsCoachUserPayload } from './buildTechnicalSkillsCoachPrompt';
import {
  parseTechnicalSkillsCoachJson,
  type TechnicalSkillsCoachAiPayload,
  type TechnicalSkillsCoachSuggestedSkill,
} from './parseTechnicalSkillsCoachJson';

const MS_24H = 24 * 60 * 60 * 1000;
const TOKENS_PER_CREDIT = 11.11;

const normalizeSuggestedSkills = (
  raw: TechnicalSkillsCoachSuggestedSkill[] | null | undefined,
): TechnicalSkillsCoachSuggestedSkill[] => {
  if (!raw?.length) return [];
  return raw.filter((row) => typeof row.title === 'string' && row.title.trim().length > 0);
};

const buildStructuredPayload = (
  parsed: TechnicalSkillsCoachAiPayload | null,
  fallbackContent: string,
): Record<string, unknown> => {
  const suggestedSkills = normalizeSuggestedSkills(parsed?.suggestedSkills ?? null);
  return {
    content: parsed?.content ?? fallbackContent,
    coachSections: parsed?.coachSections?.length ? parsed.coachSections : [],
    suggestedSkills: suggestedSkills.length ? suggestedSkills : null,
  };
};

const loadRecentChatLines = async (
  supabase: SupabaseClient,
  excludeRequestId: string,
): Promise<{ role: string; content: string }[]> => {
  const exchanges = await listTechnicalSkillsExchanges(supabase);
  const cutoff = Date.now() - MS_24H;
  const completed = exchanges.filter(
    (ex) => ex.response_id && new Date(ex.created_at).getTime() >= cutoff && ex.request_id !== excludeRequestId,
  );
  if (completed.length === 0) return [];

  const requestIds = [...new Set(completed.map((ex) => ex.request_id))];
  const responseIds = completed.map((ex) => ex.response_id as string);
  const [reqRows, resRows] = await Promise.all([
    listTechnicalSkillsRequestsByIds(supabase, requestIds),
    listTechnicalSkillsResponsesByIds(supabase, responseIds),
  ]);
  const reqById = new Map(reqRows.map((r) => [r.id, r]));
  const resById = new Map(resRows.map((r) => [r.id, r]));

  const lines: { role: string; content: string }[] = [];
  for (const ex of completed) {
    const req = reqById.get(ex.request_id);
    if (req) lines.push({ role: 'user', content: req.content });
    const resp = ex.response_id ? resById.get(ex.response_id) : undefined;
    const s = (resp?.structured ?? {}) as { content?: unknown };
    const coachText = typeof s.content === 'string' ? s.content : '';
    lines.push({ role: 'coach', content: coachText });
  }
  return lines;
};

const persistExchangeOutcome = async (
  supabase: SupabaseClient,
  params: {
    requestId: string;
    structured: Record<string, unknown>;
    ai: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
      modelUsed: string;
    } | null;
    status: 'completed' | 'failed';
  },
): Promise<{ exchangeId: string; responseId: string }> => {
  const responseId = uuidv4();
  await insertTechnicalSkillsResponse(supabase, responseId, params.structured);

  const exchangeId = uuidv4();
  const totalTokens = params.ai?.totalTokens ?? 0;
  const creditsUsed = params.ai && totalTokens > 0 ? Math.ceil(totalTokens / TOKENS_PER_CREDIT) : 0;

  await insertTechnicalSkillsExchange(supabase, {
    id: exchangeId,
    requestId: params.requestId,
    responseId,
    inputTokens: params.ai?.inputTokens ?? 0,
    outputTokens: params.ai?.outputTokens ?? 0,
    totalTokens,
    creditsUsed,
    modelUsed: params.ai?.modelUsed ?? 'none',
    status: params.status,
  });

  await updateTechnicalSkillsRequestCompletion(supabase, params.requestId, {
    exchangeId,
    responseId,
    status: params.status === 'completed' ? 'completed' : 'failed',
  });

  return { exchangeId, responseId };
};

/**
 * Persist user request, run coach AI, store response + exchange.
 *
 * @param supabase - Supabase client
 * @param anthropic - Anthropic client (null = AI unavailable)
 * @param userMessageContent - User's chat message
 */
export const processTechnicalSkillsChat = async (
  supabase: SupabaseClient,
  anthropic: Anthropic | null,
  userMessageContent: string,
): Promise<void> => {
  const requestId = uuidv4();
  await insertTechnicalSkillsRequest(supabase, {
    id: requestId,
    content: userMessageContent,
  });

  const fallback =
    'I could not generate a detailed reply right now. Please try again in a moment.';

  try {
    const recentChat = await loadRecentChatLines(supabase, requestId);

    const skillRows = await listTechnicalSkills(supabase);
    const currentSkills = skillRows
      .filter((r) => r.status === 'active')
      .map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        sort_order: r.sort_order,
      }));

    if (!anthropic) {
      await persistExchangeOutcome(supabase, {
        requestId,
        structured: buildStructuredPayload(null, 'AI is not configured. Add API keys to enable the coach.'),
        ai: null,
        status: 'completed',
      });
      return;
    }

    const systemPrompt = await loadCrmCoachSystemPrompt(
      supabase,
      CRM_AI_FLOW_PROMPT_FLOWS.TECHNICAL_SKILLS,
    );
    const userPayload = buildTechnicalSkillsCoachUserPayload({
      currentSkills,
      recentChat,
      userMessage: userMessageContent,
    });
    const aiResult = await callAI(anthropic, 'technical_skills', systemPrompt, userPayload);
    const parsed = parseTechnicalSkillsCoachJson(aiResult.responseText);
    const structured = buildStructuredPayload(parsed, fallback);

    const { exchangeId, responseId } = await persistExchangeOutcome(supabase, {
      requestId,
      structured,
      ai: {
        inputTokens: aiResult.inputTokens,
        outputTokens: aiResult.outputTokens,
        totalTokens: aiResult.totalTokens,
        modelUsed: aiResult.modelUsed,
      },
      status: 'completed',
    });

    const sugRaw = structured.suggestedSkills;
    if (Array.isArray(sugRaw) && sugRaw.length > 0) {
      const suggestions = sugRaw
        .map((row) => row as TechnicalSkillsCoachSuggestedSkill)
        .filter((row) => typeof row.title === 'string' && row.title.trim().length > 0)
        .map((row) => ({
          id: uuidv4(),
          title: typeof row.title === 'string' ? row.title : '',
          body: row.body ?? null,
          op: row.op === 'update' ? ('update' as const) : ('add' as const),
          targetSkillId: row.target_skill_id ?? null,
        }));
      if (suggestions.length > 0) {
        await insertTechnicalSkillsSuggestionsBulk(supabase, {
          exchangeId,
          responseId,
          suggestions,
        });
      }
    }
  } catch (e: unknown) {
    console.error('❌ processTechnicalSkillsChat error:', e);
    const msg = e instanceof Error ? e.message : 'Unknown error';
    try {
      await persistExchangeOutcome(supabase, {
        requestId,
        structured: buildStructuredPayload(null, `${fallback} (${msg})`),
        ai: null,
        status: 'failed',
      });
    } catch (persistErr: unknown) {
      console.error('❌ processTechnicalSkillsChat failed to persist error outcome:', persistErr);
    }
  }
};
