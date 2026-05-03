import { SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_USER_BACKGROUND_SECTIONS_JSON } from './initial-sections';
import { listUserBackgroundSegmentItemsForProfile } from './list-user-background-segment-items-for-profile';
import { saveUserBackgroundSectionsToCurrentVersion } from './save-icp-sections-current-version';
import type { UserBackgroundSectionDraftInput } from './save-icp-sections-as-new-version';

const formatSegmentBodyFromItems = (
  items: { title: string; body: string | null; sort_order: number }[],
): string | null => {
  const active = items.filter((i) => (i.body ?? '').trim() !== '' || (i.title ?? '').trim() !== '');
  if (active.length === 0) return null;
  const sorted = [...active].sort((a, b) => a.sort_order - b.sort_order);
  const chunks = sorted.map((row) => {
    const t = (row.title ?? '').trim();
    const b = (row.body ?? '').trim();
    if (t && b) return `**${t}**\n${b}`;
    if (t) return `**${t}**`;
    return b;
  });
  const joined = chunks.filter(Boolean).join('\n\n').trim();
  return joined.length ? joined : null;
};

/**
 * Recompute legacy `user_background_version_sections` bodies from active segment items (coach + blog studio compatibility).
 */
export const syncUserBackgroundVersionSectionsFromSegmentItems = async (
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
): Promise<void> => {
  const rows = await listUserBackgroundSegmentItemsForProfile(supabase, profileId);
  const active = rows.filter((r) => r.status === 'active');
  const byKey = new Map<string, typeof active>();
  for (const r of active) {
    const list = byKey.get(r.segment_key) ?? [];
    list.push(r);
    byKey.set(r.segment_key, list);
  }

  const drafts: UserBackgroundSectionDraftInput[] = INITIAL_USER_BACKGROUND_SECTIONS_JSON.map((def) => {
    const list = byKey.get(def.key) ?? [];
    const body = formatSegmentBodyFromItems(list);
    return {
      key: def.key,
      title: def.title,
      body,
    };
  });

  await saveUserBackgroundSectionsToCurrentVersion(supabase, profileId, userId, drafts);
};
