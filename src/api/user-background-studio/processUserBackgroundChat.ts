import Anthropic from '@anthropic-ai/sdk';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import {
  getUserBackgroundProfileForUser,
  listUserBackgroundStudioExchangesForProfile,
  listUserBackgroundStudioRequestsByIds,
  listUserBackgroundStudioResponsesByIds,
  insertUserBackgroundStudioRequest,
  insertUserBackgroundStudioResponse,
  insertUserBackgroundStudioExchange,
  updateUserBackgroundStudioRequestCompletion,
  listUserBackgroundSegmentItemsForProfile,
  insertUserBackgroundSegmentSuggestionsBulk,
} from '../../data/user-background-studio';
import { callAI } from './call-ai';
import { deductCredits } from './deduct-credits';
import { buildUserBackgroundCoachUserPayload } from './buildIcpCoachPrompt';
import { resolveUserBackgroundStudioSystemPrompt } from './resolve-user-background-studio-system-prompt';
import {
  parseUserBackgroundCoachJson,
  type UserBackgroundCoachAiPayload,
  type UserBackgroundSuggestedSegmentItem,
} from './parseIcpCoachJson';

const MS_24H = 24 * 60 * 60 * 1000;
const TOKENS_PER_CREDIT = 11.11;

/** Only technical_skills suggestions are valid in the scoped studio. */
const VALID_SEGMENT_KEYS = new Set<string>(['technical_skills']);

const normalizeSuggestedSegmentItems = (
  raw: UserBackgroundSuggestedSegmentItem[] | null | undefined,
): UserBackgroundSuggestedSegmentItem[] => {
  if (!raw?.length) return [];
  return raw.filter((row) => VALID_SEGMENT_KEYS.has(row.segment_key));
};

const buildStructuredPayload = (
  parsed: UserBackgroundCoachAiPayload | null,
  fallbackContent: string,
): Record<string, unknown> => {
  const suggestedSegmentItems = normalizeSuggestedSegmentItems(parsed?.suggestedSegmentItems ?? null);
  return {
    content: parsed?.content ?? fallbackContent,
    coachSections: parsed?.coachSections?.length ? parsed.coachSections : [],
    suggestedSegmentItems: suggestedSegmentItems.length ? suggestedSegmentItems : null,
  };
};

const loadRecentChatLines = async (
  supabase: SupabaseClient,
  profileId: string,
  excludeRequestId: string,
): Promise<{ role: string; content: string }[]> => {
  const exchanges = await listUserBackgroundStudioExchangesForProfile(supabase, profileId);
  const cutoff = Date.now() - MS_24H;
  const completed = exchanges.filter(
    (ex) => ex.response_id && new Date(ex.created_at).getTime() >= cutoff && ex.request_id !== excludeRequestId,
  );
  if (completed.length === 0) return [];

  const requestIds = [...new Set(completed.map((ex) => ex.request_id))];
  const responseIds = completed.map((ex) => ex.response_id as string);
  const [reqRows, resRows] = await Promise.all([
    listUserBackgroundStudioRequestsByIds(supabase, requestIds),
    listUserBackgroundStudioResponsesByIds(supabase, responseIds),
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
    userId: string;
    profileId: string;
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
  await insertUserBackgroundStudioResponse(supabase, responseId, params.structured);

  const exchangeId = uuidv4();
  const totalTokens = params.ai?.totalTokens ?? 0;
  const creditsUsed = params.ai && totalTokens > 0 ? Math.ceil(totalTokens / TOKENS_PER_CREDIT) : 0;

  await insertUserBackgroundStudioExchange(supabase, {
    id: exchangeId,
    userId: params.userId,
    profileId: params.profileId,
    requestId: params.requestId,
    responseId,
    inputTokens: params.ai?.inputTokens ?? 0,
    outputTokens: params.ai?.outputTokens ?? 0,
    totalTokens,
    creditsUsed,
    modelUsed: params.ai?.modelUsed ?? 'none',
    status: params.status,
  });

  await updateUserBackgroundStudioRequestCompletion(supabase, params.requestId, {
    exchangeId,
    responseId,
    status: params.status === 'completed' ? 'completed' : 'failed',
  });

  if (params.status === 'completed' && creditsUsed > 0) {
    await deductCredits(supabase, params.userId, creditsUsed, exchangeId, 'user_background_studio');
  }

  return { exchangeId, responseId };
};

/**
 * Persist user request, run coach AI, store response + exchange.
 * Only technical_skills segment items are sent to the model and accepted back.
 *
 * @param supabase - Supabase client
 * @param anthropic - Anthropic client (null = AI unavailable)
 * @param userId - User ID
 * @param profileId - Profile ID
 * @param userMessageContent - User's chat message
 */
export const processUserBackgroundChat = async (
  supabase: SupabaseClient,
  anthropic: Anthropic | null,
  userId: string,
  profileId: string,
  userMessageContent: string,
): Promise<void> => {
  const profile = await getUserBackgroundProfileForUser(supabase, profileId, userId);
  if (!profile) {
    throw new Error('Profile not found');
  }

  const requestId = uuidv4();
  await insertUserBackgroundStudioRequest(supabase, {
    id: requestId,
    userId,
    profileId,
    content: userMessageContent,
  });

  const fallback =
    'I could not generate a detailed reply right now. Please try again in a moment.';

  try {
    const recentChat = await loadRecentChatLines(supabase, profileId, requestId);

    const segmentRows = await listUserBackgroundSegmentItemsForProfile(supabase, profileId);
    const currentSegmentItems = segmentRows
      .filter((r) => r.status === 'active' && r.segment_key === 'technical_skills')
      .map((r) => ({
        id: r.id,
        segment_key: r.segment_key,
        title: r.title,
        body: r.body,
        sort_order: r.sort_order,
      }));

    if (!anthropic) {
      await persistExchangeOutcome(supabase, {
        userId,
        profileId,
        requestId,
        structured: buildStructuredPayload(null, 'AI is not configured. Add API keys to enable the coach.'),
        ai: null,
        status: 'completed',
      });
      return;
    }

    const systemPrompt = await resolveUserBackgroundStudioSystemPrompt(supabase, userId);
    const userPayload = buildUserBackgroundCoachUserPayload({
      currentSegmentItems,
      recentChat,
      userMessage: userMessageContent,
    });
    const aiResult = await callAI(anthropic, 'user_background_studio', systemPrompt, userPayload);
    const parsed = parseUserBackgroundCoachJson(aiResult.responseText);
    const structured = buildStructuredPayload(parsed, fallback);

    const { exchangeId, responseId } = await persistExchangeOutcome(supabase, {
      userId,
      profileId,
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

    const segRaw = structured.suggestedSegmentItems;
    if (Array.isArray(segRaw) && segRaw.length > 0) {
      const suggestions = segRaw
        .map((row) => row as UserBackgroundSuggestedSegmentItem)
        .filter((row) => VALID_SEGMENT_KEYS.has(row.segment_key))
        .map((row) => ({
          id: uuidv4(),
          segmentKey: row.segment_key,
          title: typeof row.title === 'string' ? row.title : '',
          body: row.body ?? null,
          op: row.op === 'update' ? ('update' as const) : ('add' as const),
          targetItemId: row.target_item_id ?? null,
        }));
      if (suggestions.length > 0) {
        await insertUserBackgroundSegmentSuggestionsBulk(supabase, {
          profileId,
          exchangeId,
          responseId,
          suggestions,
        });
      }
    }
  } catch (e: unknown) {
    console.error('❌ processUserBackgroundChat error:', e);
    const msg = e instanceof Error ? e.message : 'Unknown error';
    try {
      await persistExchangeOutcome(supabase, {
        userId,
        profileId,
        requestId,
        structured: buildStructuredPayload(null, `${fallback} (${msg})`),
        ai: null,
        status: 'failed',
      });
    } catch (persistErr: unknown) {
      console.error('❌ processUserBackgroundChat failed to persist error outcome:', persistErr);
    }
  }
};
