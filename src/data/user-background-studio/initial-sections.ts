/**
 * Default User Background / experience sections — mirrors luckee-web User Background Studio categories.
 */
export const INITIAL_USER_BACKGROUND_SECTIONS_JSON = [
  { key: 'technical_skills', title: 'Technical Skills', body: null as string | null },
  { key: 'domain_expertise', title: 'Domain Expertise', body: null },
  { key: 'roles_functions', title: 'Roles & Functions', body: null },
  { key: 'project_types', title: 'Project Types', body: null },
  { key: 'work_experience', title: 'Work Experience', body: null },
  { key: 'education', title: 'Education', body: null },
  { key: 'writing_preferences', title: 'Writing Preferences', body: null },
] as const;

export const initialUserBackgroundSectionsAsInputs = (): {
  key: string;
  title: string;
  body: string | null;
  sortOrder: number;
}[] =>
  INITIAL_USER_BACKGROUND_SECTIONS_JSON.map((s, i) => ({
    key: s.key,
    title: s.title,
    body: s.body,
    sortOrder: i,
  }));
