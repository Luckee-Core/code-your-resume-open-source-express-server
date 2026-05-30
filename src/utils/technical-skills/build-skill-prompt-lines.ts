import type { TechnicalSkillRow } from '../../data/technical-skills/list-technical-skills';

/**
 * Formats active technical skills as prompt lines for generation APIs.
 *
 * @param rows - All technical skill rows from Supabase
 * @returns Non-empty prompt strings: "title" or "title — body"
 */
export const buildSkillPromptLines = (rows: TechnicalSkillRow[]): string[] => {
  return rows
    .filter((row) => row.status === 'active')
    .map((row) => {
      const title = row.title?.trim() ?? '';
      const body = row.body?.trim() ?? '';
      if (!title) return '';
      return body ? `${title} — ${body}` : title;
    })
    .filter(Boolean);
};
