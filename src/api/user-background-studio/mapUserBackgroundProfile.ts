import { SupabaseClient } from '@supabase/supabase-js';
import {
  listUserBackgroundVersions,
  listUserBackgroundVersionSectionsForVersionIds,
  listUserBackgroundStudioExchangesForProfile,
  listUserBackgroundStudioRequestsByIds,
  listUserBackgroundStudioResponsesByIds,
  listUserBackgroundSegmentItemsForProfile,
  listUserBackgroundSegmentSuggestionsByResponseIds,
  type UserBackgroundProfileRow,
  type UserBackgroundVersionRow,
  type UserBackgroundVersionSectionRow,
} from '../../data/user-background-studio';

const formatVersionDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const formatMessageClock = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const sectionRowToApi = (row: UserBackgroundVersionSectionRow) => ({
  key: row.section_key,
  title: row.title,
  body: row.body,
  ...(row.last_version ? { lastVersion: row.last_version } : {}),
});

type StructuredCoach = {
  content?: unknown;
  coachSections?: unknown;
  suggestedSections?: unknown;
  updatedSections?: unknown;
  suggestedSegmentItems?: unknown;
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

const isSuggestedSection = (x: unknown): x is { key: string; title: string; body: string | null; lastVersion?: string } => {
  if (!x || typeof x !== 'object') return false;
  const o = x as { key?: unknown; title?: unknown; body?: unknown };
  return typeof o.key === 'string' && typeof o.title === 'string' && (o.body === null || typeof o.body === 'string');
};

const normalizeSuggestedSections = (structured: StructuredCoach): { key: string; title: string; body: string | null; lastVersion?: string }[] | undefined => {
  const primary = structured.suggestedSections;
  const legacy = structured.updatedSections;
  const raw = Array.isArray(primary) && primary.length > 0 ? primary : Array.isArray(legacy) && legacy.length > 0 ? legacy : null;
  if (!raw) return undefined;
  const out = raw.filter(isSuggestedSection);
  return out.length ? out : undefined;
};

/**
 * Build API profile payload (camelCase) for one user background profile.
 */
export const buildUserBackgroundProfilePayload = async (
  supabase: SupabaseClient,
  profile: UserBackgroundProfileRow,
): Promise<{
  id: string;
  name: string;
  description: string | null;
  currentVersion: number;
  updatedAt: string;
  segmentItems: {
    id: string;
    segmentKey: string;
    sortOrder: number;
    title: string;
    body: string | null;
    status: string;
    sourceExchangeId: string | null;
    metadata: Record<string, unknown>;
  }[];
  versions: {
    version: number;
    label: string;
    date: string;
    sections: unknown;
  }[];
  messages: {
    id: string;
    role: 'user' | 'coach';
    content: string;
    sections?: { heading: string; bullets: string[] }[];
    suggestedSections?: { key: string; title: string; body: string | null; lastVersion?: string }[];
    suggestedSegmentItems?: {
      id: string;
      segmentKey: string;
      title: string;
      body: string | null;
      op: 'add' | 'update';
      targetItemId: string | null;
      exchangeId: string;
    }[];
    timestamp: string;
    rawTime: string;
  }[];
}> => {
  const versionRows = await listUserBackgroundVersions(supabase, profile.id);
  const versionIds = versionRows.map((v: UserBackgroundVersionRow) => v.id);
  const allSectionRows = await listUserBackgroundVersionSectionsForVersionIds(supabase, versionIds);
  const byVersionId = new Map<string, UserBackgroundVersionSectionRow[]>();
  for (const row of allSectionRows) {
    const list = byVersionId.get(row.profile_version_id) ?? [];
    list.push(row);
    byVersionId.set(row.profile_version_id, list);
  }
  for (const list of byVersionId.values()) {
    list.sort((a, b) => a.sort_order - b.sort_order);
  }

  const versions = versionRows.map((v: UserBackgroundVersionRow) => ({
    version: v.version,
    label: v.label ?? `v${v.version}`,
    date: formatVersionDate(v.snapshot_at),
    sections: (byVersionId.get(v.id) ?? []).map(sectionRowToApi),
  }));

  const segmentItemRows = await listUserBackgroundSegmentItemsForProfile(supabase, profile.id);
  const segmentItems = segmentItemRows.map((r) => ({
    id: r.id,
    segmentKey: r.segment_key,
    sortOrder: r.sort_order,
    title: r.title,
    body: r.body,
    status: r.status,
    sourceExchangeId: r.source_exchange_id,
    metadata: (r.metadata ?? {}) as Record<string, unknown>,
  }));

  const exchangeRows = await listUserBackgroundStudioExchangesForProfile(supabase, profile.id);
  const withResponse = exchangeRows.filter((ex) => ex.response_id);
  const requestIds = [...new Set(withResponse.map((ex) => ex.request_id))];
  const responseIds = withResponse.map((ex) => ex.response_id as string);
  const [reqRows, resRows] = await Promise.all([
    listUserBackgroundStudioRequestsByIds(supabase, requestIds),
    listUserBackgroundStudioResponsesByIds(supabase, responseIds),
  ]);
  const reqById = new Map(reqRows.map((r) => [r.id, r]));
  const resById = new Map(resRows.map((r) => [r.id, r]));

  const suggestionRows = await listUserBackgroundSegmentSuggestionsByResponseIds(supabase, responseIds);
  const pendingSuggestionsByResponse = new Map<
    string,
    {
      id: string;
      segmentKey: string;
      title: string;
      body: string | null;
      op: 'add' | 'update';
      targetItemId: string | null;
      exchangeId: string;
    }[]
  >();
  for (const s of suggestionRows) {
    if (s.status !== 'pending') continue;
    const op = s.op === 'update' ? 'update' : 'add';
    const list = pendingSuggestionsByResponse.get(s.response_id) ?? [];
    list.push({
      id: s.id,
      segmentKey: s.segment_key,
      title: s.title,
      body: s.body,
      op,
      targetItemId: s.target_item_id,
      exchangeId: s.exchange_id,
    });
    pendingSuggestionsByResponse.set(s.response_id, list);
  }

  const messages: {
    id: string;
    role: 'user' | 'coach';
    content: string;
    sections?: { heading: string; bullets: string[] }[];
    suggestedSections?: { key: string; title: string; body: string | null; lastVersion?: string }[];
    suggestedSegmentItems?: {
      id: string;
      segmentKey: string;
      title: string;
      body: string | null;
      op: 'add' | 'update';
      targetItemId: string | null;
      exchangeId: string;
    }[];
    timestamp: string;
    rawTime: string;
  }[] = [];

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
      typeof structured.content === 'string'
        ? structured.content
        : 'No response content.';
    const coachBlocks = normalizeCoachSections(structured.coachSections);
    const suggested = normalizeSuggestedSections(structured);
    const pendingSeg = pendingSuggestionsByResponse.get(rid) ?? [];
    messages.push({
      id: rid,
      role: 'coach',
      content,
      ...(coachBlocks ? { sections: coachBlocks } : {}),
      ...(suggested ? { suggestedSections: suggested } : {}),
      ...(pendingSeg.length ? { suggestedSegmentItems: pendingSeg } : {}),
      timestamp: formatMessageClock(ex.created_at),
      rawTime: ex.created_at,
    });
  }

  return {
    id: profile.id,
    name: profile.name,
    description: profile.description ?? null,
    currentVersion: profile.current_version,
    updatedAt: profile.updated_at,
    segmentItems,
    versions,
    messages,
  };
};
