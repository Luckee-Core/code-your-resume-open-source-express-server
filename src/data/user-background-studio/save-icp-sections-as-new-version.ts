import { SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_USER_BACKGROUND_SECTIONS_JSON } from './initial-sections';
import { getUserBackgroundProfileForUser } from './get-icp-for-user';
import { insertUserBackgroundVersionWithSections } from './insert-icp-version';
import { setUserBackgroundProfileCurrentVersion } from './set-icp-current-version';
import { relabelUserBackgroundVersionsForCurrent } from './relabel-icp-versions-for-current';
import type { SectionInput } from './insert-icp-version-sections-bulk';

export type UserBackgroundSectionDraftInput = {
  key: string;
  title: string;
  body: string | null;
  lastVersion?: string;
};

/**
 * Map client section rows onto the canonical 7 keys (merge with defaults for any missing key).
 */
export const mergeUbSectionDraftsToInputs = (incoming: UserBackgroundSectionDraftInput[]): SectionInput[] => {
  const byKey = new Map(incoming.map((s) => [s.key, s]));
  return INITIAL_USER_BACKGROUND_SECTIONS_JSON.map((def, i) => {
    const row = byKey.get(def.key);
    const title = row?.title?.trim() ? row.title.trim() : def.title;
    const body = row?.body != null && row.body.trim() === '' ? null : row?.body ?? null;
    const lastVersion = row?.lastVersion?.trim() || undefined;
    return {
      key: def.key,
      title,
      body,
      lastVersion,
      sortOrder: i,
    };
  });
};

/**
 * Persist user-edited sections as a new immutable version and point current_version at it.
 */
export const saveUserBackgroundSectionsAsNewVersion = async (
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
  drafts: UserBackgroundSectionDraftInput[],
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(supabase, profileId, userId);
  if (!icp) {
    throw new Error('ICP not found');
  }

  const sections = mergeUbSectionDraftsToInputs(drafts);
  const nextVersion = icp.current_version + 1;
  const label = `v${nextVersion} (current)`;

  await insertUserBackgroundVersionWithSections(supabase, profileId, nextVersion, label, sections);
  await setUserBackgroundProfileCurrentVersion(supabase, profileId, userId, nextVersion);
  await relabelUserBackgroundVersionsForCurrent(supabase, profileId, nextVersion);
};
