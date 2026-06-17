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
  voiceStyle: string;
  projectsBlock: string;
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
    voiceStyle,
    projectsBlock,
    skills = [],
  } = input;

  const companyLine = companyName?.trim()
    ? `Company: ${companyName.trim()}`
    : 'Company: (not provided — write about the role and what you can infer from the posting)';

  const projects = projectsBlock || '(no projects recorded)';

  const hasPostingBullets = responsibilities.length > 0 || requirements.length > 0;
  const postingBulletsRule = hasPostingBullets
    ? `- This posting includes responsibility and/or requirement bullets below. Reference **one or two** of them in plain language (paraphrase is fine). Do not stack every bullet or turn the answer into a skills checklist.`
    : `- Responsibilities and/or requirements may be sparse below; write naturally without inventing posting details.`;

  return {
    jobId,
    jobTitle: jobTitle.trim(),
    companyLine,
    responsibilitiesBlock: formatBulletList(responsibilities, '(none provided)'),
    requirementsBlock: formatBulletList(requirements, '(none provided)'),
    niceToHavesBlock: formatBulletList(niceToHaves, '(none provided)'),
    skillsBlock:
      skills.length > 0 ? skills.map((s) => `- ${s}`).join('\n') : '(none provided)',
    voice_style: voiceStyle || '(empty)',
    projects,
    portfolio_github: projects,
    canvasWidthPx: String(canvasWidthPx),
    canvasHeightPx: String(canvasHeightPx),
    companyInterestQuestion: COMPANY_INTEREST_QUESTION,
    postingBulletsRule,
  };
};

/**
 * Render the company interest Cursor agent prompt from a DB template.
 */
export const buildCompanyInterestPromptFromTemplate = (
  template: string,
  input: BuildCompanyInterestPromptInput,
): string => renderPromptTemplate(template, buildCompanyInterestPromptVars(input));
