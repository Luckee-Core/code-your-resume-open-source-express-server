export type UserBackgroundSuggestedSegmentItem = {
  segment_key: string;
  title: string;
  body: string | null;
  op?: 'add' | 'update';
  target_item_id?: string | null;
};

export type UserBackgroundCoachAiPayload = {
  content: string;
  coachSections?: { heading: string; bullets: string[] }[];
  /** Row-level additions/updates; persisted as pending suggestions after the exchange is saved. */
  suggestedSegmentItems?: UserBackgroundSuggestedSegmentItem[] | null;
  /** Proposed ICP edits — stored only on the response row; never auto-applied. */
  suggestedSections?: { key: string; title: string; body: string | null; lastVersion?: string }[];
  /** @deprecated Model may still emit this; treated like suggestedSections. */
  updatedSections?: { key: string; title: string; body: string | null; lastVersion?: string }[];
};

/**
 * Parse model output into structured ICP coach payload (JSON or fenced block).
 */
export const parseUserBackgroundCoachJson = (text: string): UserBackgroundCoachAiPayload | null => {
  const trimmed = text.trim();
  const tryParse = (s: string): UserBackgroundCoachAiPayload | null => {
    try {
      const o = JSON.parse(s) as UserBackgroundCoachAiPayload;
      if (typeof o.content === 'string') {
        if (!o.suggestedSections?.length && o.updatedSections?.length) {
          o.suggestedSections = o.updatedSections;
        }
        if (!o.suggestedSegmentItems?.length && o.suggestedSections?.length) {
          o.suggestedSegmentItems = o.suggestedSections
            .filter((sec) => sec.body != null && String(sec.body).trim() !== '')
            .map((sec) => ({
              segment_key: sec.key,
              title: sec.title,
              body: sec.body,
              op: 'add' as const,
            }));
        }
        return o;
      }
    } catch {
      return null;
    }
    return null;
  };

  let parsed = tryParse(trimmed);
  if (parsed) return parsed;

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) {
    parsed = tryParse(fence[1].trim());
    if (parsed) return parsed;
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) {
    parsed = tryParse(trimmed.slice(start, end + 1));
    if (parsed) return parsed;
  }

  return null;
};
