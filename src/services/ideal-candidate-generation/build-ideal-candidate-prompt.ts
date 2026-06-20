import { renderPromptTemplate } from '../../utils/ai/render-prompt-template';

export type BuildIdealCandidatePromptInput = {
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

const IDEAL_CANDIDATE_QUESTION =
  'In your own words, briefly describe what makes you the ideal candidate for this position.';

const formatBulletList = (items: string[], emptyLabel: string): string => {
  if (!items.length) {
    return emptyLabel;
  }
  return items.map((item) => `- ${item}`).join('\n');
};

/**
 * Build placeholder vars for the ideal candidate Cursor agent template.
 */
export const buildIdealCandidatePromptVars = (
  input: BuildIdealCandidatePromptInput,
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
    ? `- This posting has bullets below. Mention **one** in plain words (paraphrase OK). Do not echo the whole job description or turn the answer into a checklist.`
    : `- Posting bullets may be sparse below; write naturally without inventing posting details.`;

  const trimmedVoice = voiceStyle.trim();
  const voiceStyleRule = trimmedVoice
    ? '- **Voice is law:** The voice/style block above is how this person writes. Match sentence length, vocabulary, contractions, and attitude. If it lists phrases to avoid or preferred openers, obey them. Never smooth their voice into generic AI-engineer or LinkedIn copy.'
    : '- Voice/style is empty — still write plainly; no corporate polish or AI resume tone.';

  const backgroundScopeRule =
    '- **Background scope:** Only reference software engineering and product-building work from projects. ' +
    'Do not connect non-software history to the role.';

  return {
    jobId,
    jobTitle: jobTitle.trim(),
    companyLine,
    responsibilitiesBlock: formatBulletList(responsibilities, '(none provided)'),
    requirementsBlock: formatBulletList(requirements, '(none provided)'),
    niceToHavesBlock: formatBulletList(niceToHaves, '(none provided)'),
    skillsBlock:
      skills.length > 0 ? skills.map((s) => `- ${s}`).join('\n') : '(none provided)',
    voice_style: trimmedVoice || '(empty)',
    projects,
    portfolio_github: projects,
    canvasWidthPx: String(canvasWidthPx),
    canvasHeightPx: String(canvasHeightPx),
    idealCandidateQuestion: IDEAL_CANDIDATE_QUESTION,
    postingBulletsRule,
    voiceStyleRule,
    backgroundScopeRule,
  };
};

/**
 * Render the ideal candidate Cursor agent prompt from a DB template.
 */
export const buildIdealCandidatePromptFromTemplate = (
  template: string,
  input: BuildIdealCandidatePromptInput,
): string => renderPromptTemplate(template, buildIdealCandidatePromptVars(input));
