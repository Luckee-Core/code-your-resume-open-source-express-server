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
  professionalBackgroundSegments?: {
    education: string;
    credibility_bio: string;
    voice_style: string;
    portfolio_github: string;
  };
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
    professionalBackgroundSegments,
  } = input;

  const companyLine = companyName?.trim()
    ? `Company: ${companyName.trim()}`
    : 'Company: (not provided)';

  const hasPostingBullets = responsibilities.length > 0 || requirements.length > 0;
  const postingEmphasisRule = hasPostingBullets
    ? `Read **Responsibilities** and **Requirements** below first. Infer what this **${jobTitle.trim()}** role weights most (e.g. AI/LLM/agents, mobile, full-stack product, infra, FDE/customer-facing delivery, etc.) from repetition and specificity — **do not assume a fixed lead theme**.`
    : `Posting bullets may be sparse — infer emphasis from **${jobTitle.trim()}**, company context, and skills; still prioritize relevance over a generic stack laundry list.`;

  const professionalBackgroundBlock = professionalBackgroundSegments
    ? `\n### Professional background (factual source — do not invent beyond this)\n\nEducation:\n${professionalBackgroundSegments.education || '(empty)'}\n\nCredibility bio:\n${professionalBackgroundSegments.credibility_bio || '(empty)'}\n\nVoice/style notes:\n${professionalBackgroundSegments.voice_style || '(empty)'}\n\nPortfolio/GitHub narrative (**same Acme Labs / THT body of work** as credibility_bio — NOT a second employer; merge every product and client build listed here into the **single** Acme Labs Experience entry):\n${professionalBackgroundSegments.portfolio_github || '(empty)'}\n`
    : '';

  return {
    jobId,
    jobTitle: jobTitle.trim(),
    companyLine,
    responsibilitiesBlock: formatBulletList(responsibilities, '(none provided)'),
    requirementsBlock: formatBulletList(requirements, '(none provided)'),
    niceToHavesBlock: formatBulletList(niceToHaves, '(none provided)'),
    skillsList: skills.map((s) => `- ${s}`).join('\n'),
    postingEmphasisRule,
    professionalBackgroundBlock,
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
