import { renderPromptTemplate } from '../../utils/ai/render-prompt-template';

export type BuildCompanyInterestPromptInput = {
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

const COMPANY_INTEREST_QUESTION =
  'What interests you about working for this company?';

const formatBulletList = (items: string[], emptyLabel: string): string => {
  if (!items.length) {
    return emptyLabel;
  }
  return items.map((item) => `- ${item}`).join('\n');
};

/**
 * Build placeholder vars for the company interest Cursor agent template.
 */
export const buildCompanyInterestPromptVars = (
  input: BuildCompanyInterestPromptInput,
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
    : 'Company: (not provided — write about the role and what you can infer from the posting)';

  const { education, credibility_bio, voice_style, portfolio_github } =
    professionalBackgroundSegments;

  return {
    jobId,
    jobTitle: jobTitle.trim(),
    companyLine,
    responsibilitiesBlock: formatBulletList(responsibilities, '(none provided)'),
    requirementsBlock: formatBulletList(requirements, '(none provided)'),
    niceToHavesBlock: formatBulletList(niceToHaves, '(none provided)'),
    skillsBlock:
      skills.length > 0 ? skills.map((s) => `- ${s}`).join('\n') : '(none provided)',
    education: education || '(empty)',
    credibility_bio: credibility_bio || '(empty)',
    voice_style: voice_style || '(empty)',
    portfolio_github: portfolio_github || '(empty)',
    canvasWidthPx: String(canvasWidthPx),
    canvasHeightPx: String(canvasHeightPx),
    companyInterestQuestion: COMPANY_INTEREST_QUESTION,
  };
};

/**
 * Render the company interest Cursor agent prompt from a DB template.
 */
export const buildCompanyInterestPromptFromTemplate = (
  template: string,
  input: BuildCompanyInterestPromptInput,
): string => renderPromptTemplate(template, buildCompanyInterestPromptVars(input));
