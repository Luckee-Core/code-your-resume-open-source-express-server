import { renderPromptTemplate } from '../../utils/ai/render-prompt-template';

export type BuildCoverLetterPromptInput = {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves?: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  professionalBackgroundSegments: {
    education: string;
    credibility_bio: string;
    voice_style: string;
    portfolio_github: string;
  };
  skills?: string[];
};

const formatBulletList = (items: string[], emptyLabel: string): string => {
  if (!items.length) {
    return emptyLabel;
  }
  return items.map((item) => `- ${item}`).join('\n');
};

/**
 * Build placeholder vars for the cover letter Cursor agent template.
 */
export const buildCoverLetterPromptVars = (
  input: BuildCoverLetterPromptInput,
): Record<string, string> => {
  const {
    jobId,
    jobTitle,
    companyName,
    responsibilities,
    requirements,
    niceToHaves = [],
    canvasWidthPx,
    canvasHeightPx,
    professionalBackgroundSegments,
    skills = [],
  } = input;

  const companyLine = companyName?.trim()
    ? `Company: ${companyName.trim()}`
    : 'Company: (not provided)';

  const responsibilitiesBlock = formatBulletList(responsibilities, '(none provided)');
  const requirementsBlock = formatBulletList(requirements, '(none provided)');
  const niceToHavesBlock = formatBulletList(niceToHaves, '(none provided)');
  const skillsBlock =
    skills.length > 0 ? skills.map((s) => `- ${s}`).join('\n') : '(none provided)';

  const { education, credibility_bio, voice_style, portfolio_github } =
    professionalBackgroundSegments;

  const hasPostingBullets = responsibilities.length > 0 || requirements.length > 0;
  const postingBulletsRule = hasPostingBullets
    ? `- This posting includes ${responsibilities.length} responsibility bullet(s) and ${requirements.length} requirement bullet(s) below. You MUST reference several of them specifically (paraphrase is fine). NEVER claim the posting "does not list" responsibilities or requirements, and NEVER invent a "broad mandate" narrative when bullets are provided.`
    : `- Responsibilities and/or requirements may be sparse below; write naturally without claiming the posting is empty if other context exists.`;

  return {
    jobId,
    jobTitle: jobTitle.trim(),
    companyLine,
    responsibilitiesBlock,
    requirementsBlock,
    niceToHavesBlock,
    skillsBlock,
    education: education || '(empty)',
    credibility_bio: credibility_bio || '(empty)',
    voice_style: voice_style || '(empty)',
    portfolio_github: portfolio_github || '(empty)',
    canvasWidthPx: String(canvasWidthPx),
    canvasHeightPx: String(canvasHeightPx),
    postingBulletsRule,
  };
};

/**
 * Render the cover letter Cursor agent prompt from a DB template.
 */
export const buildCoverLetterPromptFromTemplate = (
  template: string,
  input: BuildCoverLetterPromptInput,
): string => renderPromptTemplate(template, buildCoverLetterPromptVars(input));
