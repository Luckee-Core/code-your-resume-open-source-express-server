import { SupabaseClient } from '@supabase/supabase-js';
import {
  listTechnicalSkills,
  listTechnicalSkillsExchanges,
  listTechnicalSkillsRequestsByIds,
  listTechnicalSkillsResponsesByIds,
  listTechnicalSkillsSuggestionsByResponseIds,
  type TechnicalSkillRow,
} from '../../data/technical-skills';

const formatMessageClock = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

type StructuredCoach = {
  content?: unknown;
  coachSections?: unknown;
  suggestedSkills?: unknown;
};

const isCoachSectionBlock = (x: unknown): x is { heading: string; bullets: string[] } => {
  if (!x || typeof x !== 'object') return false;
  const o = x as { heading?: unknown; bullets?: unknown };
  return typeof o.heading === 'string' && Array.isArray(o.bullets) && o.bullets.every((b) => typeof b === 'string');
};

const normalizeCoachSections = (raw: unknown): { heading: string; bullets: string[] }[] | undefined => {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const blocks = raw.filter(isCoachSectionBlock);
  return blocks.length ? blocks : undefined;
};

export type TechnicalSkillsPayload = {
  skills: {
    id: string;
    sortOrder: number;
    title: string;
    body: string | null;
    status: string;
    sourceExchangeId: string | null;
  }[];
  messages: {
    id: string;
    role: 'user' | 'coach';
    content: string;
    sections?: { heading: string; bullets: string[] }[];
    suggestedSkills?: {
      id: string;
      title: string;
      body: string | null;
      op: 'add' | 'update';
      targetSkillId: string | null;
      exchangeId: string;
    }[];
    timestamp: string;
    rawTime: string;
  }[];
};

/**
 * Build the full technical skills studio payload: skill rows + chat history + pending suggestions.
 */
export const loadTechnicalSkillsPayload = async (
  supabase: SupabaseClient,
): Promise<TechnicalSkillsPayload> => {
  const skillRows = await listTechnicalSkills(supabase);
  const skills = skillRows.map((r: TechnicalSkillRow) => ({
    id: r.id,
    sortOrder: r.sort_order,
    title: r.title,
    body: r.body,
    status: r.status,
    sourceExchangeId: r.source_exchange_id,
  }));

  const exchangeRows = await listTechnicalSkillsExchanges(supabase);
  const withResponse = exchangeRows.filter((ex) => ex.response_id);
  const requestIds = [...new Set(withResponse.map((ex) => ex.request_id))];
  const responseIds = withResponse.map((ex) => ex.response_id as string);

  const [reqRows, resRows] = await Promise.all([
    listTechnicalSkillsRequestsByIds(supabase, requestIds),
    listTechnicalSkillsResponsesByIds(supabase, responseIds),
  ]);
  const reqById = new Map(reqRows.map((r) => [r.id, r]));
  const resById = new Map(resRows.map((r) => [r.id, r]));

  const suggestionRows = await listTechnicalSkillsSuggestionsByResponseIds(supabase, responseIds);
  const pendingSuggestionsByResponse = new Map<
    string,
    {
      id: string;
      title: string;
      body: string | null;
      op: 'add' | 'update';
      targetSkillId: string | null;
      exchangeId: string;
    }[]
  >();
  for (const s of suggestionRows) {
    if (s.status !== 'pending') continue;
    const op = s.op === 'update' ? 'update' : 'add';
    const list = pendingSuggestionsByResponse.get(s.response_id) ?? [];
    list.push({
      id: s.id,
      title: s.title,
      body: s.body,
      op,
      targetSkillId: s.target_skill_id,
      exchangeId: s.exchange_id,
    });
    pendingSuggestionsByResponse.set(s.response_id, list);
  }

  const messages: TechnicalSkillsPayload['messages'] = [];

  for (const ex of withResponse) {
    const req = reqById.get(ex.request_id);
    if (req) {
      messages.push({
        id: req.id,
        role: 'user',
        content: req.content,
        timestamp: formatMessageClock(req.created_at),
        rawTime: req.created_at,
      });
    }
    const rid = ex.response_id as string;
    const resp = resById.get(rid);
    const structured = (resp?.structured ?? {}) as StructuredCoach;
    const content =
      typeof structured.content === 'string' ? structured.content : 'No response content.';
    const coachBlocks = normalizeCoachSections(structured.coachSections);
    const pendingSug = pendingSuggestionsByResponse.get(rid) ?? [];
    messages.push({
      id: rid,
      role: 'coach',
      content,
      ...(coachBlocks ? { sections: coachBlocks } : {}),
      ...(pendingSug.length ? { suggestedSkills: pendingSug } : {}),
      timestamp: formatMessageClock(ex.created_at),
      rawTime: ex.created_at,
    });
  }

  return { skills, messages };
};
