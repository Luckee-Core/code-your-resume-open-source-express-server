import { renderPromptTemplate } from '../../utils/ai/render-prompt-template';

export type BuildSkillsComponentPromptInput = {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves?: string[];
  skills: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  voiceStyle?: string;
  projectsBlock?: string;
  pointOfEmphasis?: string;
  candidateFullName?: string;
};

const formatBulletList = (items: string[], emptyLabel: string): string => {
  if (!items.length) {
    return emptyLabel;
  }
  return items.map((item) => `- ${item}`).join('\n');
};

/**
 * Build placeholder vars for the skills component Cursor agent template.
 */
export const buildSkillsComponentPromptVars = (
  input: BuildSkillsComponentPromptInput,
): Record<string, string> => {
  const {
    jobId,
    jobTitle,
    companyName,
    responsibilities,
    requirements,
    niceToHaves = [],
    skills,
    canvasWidthPx,
    canvasHeightPx,
    voiceStyle = '',
    projectsBlock,
    pointOfEmphasis,
    candidateFullName = '',
  } = input;

  const companyLine = companyName?.trim()
    ? `Company: ${companyName.trim()}`
    : 'Company: (not provided)';

  const hasPostingBullets = responsibilities.length > 0 || requirements.length > 0;
  const postingEmphasisRule = hasPostingBullets
    ? `Read **Responsibilities** and **Requirements** below first. Infer what this **${jobTitle.trim()}** role weights most (e.g. AI/LLM/agents, mobile, full-stack product, infra, FDE/customer-facing delivery, etc.) from repetition and specificity — **do not assume a fixed lead theme**.`
    : `Posting bullets may be sparse — infer emphasis from **${jobTitle.trim()}**, company context, and skills; still prioritize relevance over a generic stack laundry list.`;

  const projects = projectsBlock?.trim() || '(no projects recorded)';

  const projectsBlockSection = `\n### Projects (each ### heading is the employer/organization name — use exactly in Experience)\n\n${projects}\n`;

  const emphasisTrimmed = pointOfEmphasis?.trim() ?? '';
  const pointOfEmphasisBlock = emphasisTrimmed || '(none provided)';
  const pointOfEmphasisRule = emphasisTrimmed
    ? `- The candidate provided **focus points** below. Use them to steer the executive summary opening and Experience bullet ordering — emphasize the skills, stack, or themes they name when supported by the skills list and projects. Connect their focus to specific responsibilities or requirements from the posting. Do not invent employers, metrics, or experiences beyond what the inputs support.`
    : `- No focus points were provided; infer emphasis from the posting and skills/projects alone per postingEmphasisRule.`;

  const candidateNameLine = candidateFullName.trim()
    ? `Candidate full name: ${candidateFullName.trim()}`
    : 'Candidate full name: (sync My LinkedIn first)';

  return {
    jobId,
    jobTitle: jobTitle.trim(),
    companyLine,
    candidateNameLine,
    responsibilitiesBlock: formatBulletList(responsibilities, '(none provided)'),
    requirementsBlock: formatBulletList(requirements, '(none provided)'),
    niceToHavesBlock: formatBulletList(niceToHaves, '(none provided)'),
    skillsList: skills.map((s) => `- ${s}`).join('\n'),
    postingEmphasisRule,
    pointOfEmphasisBlock,
    pointOfEmphasisRule,
    projectsBlock: projectsBlockSection,
    voice_style: voiceStyle || '(empty)',
    canvasWidthPx: String(canvasWidthPx),
    canvasHeightPx: String(canvasHeightPx),
  };
};

/**
 * Render the skills component Cursor agent prompt from a DB template.
 */
export const buildSkillsComponentPromptFromTemplate = (
  template: string,
  input: BuildSkillsComponentPromptInput,
): string => renderPromptTemplate(template, buildSkillsComponentPromptVars(input));
