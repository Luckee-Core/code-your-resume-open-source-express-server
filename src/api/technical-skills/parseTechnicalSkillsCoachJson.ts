export type TechnicalSkillsCoachSuggestedSkill = {
  title: string;
  body: string | null;
  op?: 'add' | 'update';
  target_skill_id?: string | null;
};

export type TechnicalSkillsCoachAiPayload = {
  content: string;
  coachSections?: { heading: string; bullets: string[] }[];
  suggestedSkills?: TechnicalSkillsCoachSuggestedSkill[] | null;
};

/**
 * Parse model output into structured technical skills coach payload (JSON or fenced block).
 */
export const parseTechnicalSkillsCoachJson = (text: string): TechnicalSkillsCoachAiPayload | null => {
  const trimmed = text.trim();
  const tryParse = (s: string): TechnicalSkillsCoachAiPayload | null => {
    try {
      const o = JSON.parse(s) as TechnicalSkillsCoachAiPayload;
      if (typeof o.content === 'string') {
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
