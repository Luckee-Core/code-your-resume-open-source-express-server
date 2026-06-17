import { renderPromptTemplate } from '../../utils/ai/render-prompt-template';

export type BuildTeamConversationPromptInput = {
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

const formatBulletList = (items: string[], emptyLabel: string): string => {
  if (!items.length) {
    return emptyLabel;
  }
  return items.map((item) => `- ${item}`).join('\n');
};

/**
 * Build the YC-style team conversation prompt shown in the generated UI.
 */
export const buildTeamConversationQuestion = (companyName?: string): string => {
  const trimmed = companyName?.trim();
  if (trimmed) {
    return (
      `Start a conversation with the team at ${trimmed}. Share something about you, ` +
      `what you're looking for, or why ${trimmed} interests you. Human-written messages ` +
      `are more likely to get a response.`
    );
  }
  return (
    "Start a conversation with the team. Share something about you, what you're looking for, " +
    'or why this role interests you. Human-written messages are more likely to get a response.'
  );
};

/**
 * Build placeholder vars for the team conversation Cursor agent template.
 */
export const buildTeamConversationPromptVars = (
  input: BuildTeamConversationPromptInput,
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
    ? `- This posting has bullets below. Mention **one** in plain words (paraphrase OK). Do not echo the whole job description or turn the note into a checklist.`
    : `- Posting bullets may be sparse below; write naturally without inventing posting details.`;

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
    voice_style: voiceStyle || '(empty)',
    projects,
    portfolio_github: projects,
    canvasWidthPx: String(canvasWidthPx),
    canvasHeightPx: String(canvasHeightPx),
    teamConversationQuestion: buildTeamConversationQuestion(companyName),
    postingBulletsRule,
    backgroundScopeRule,
  };
};

/**
 * Render the team conversation Cursor agent prompt from a DB template.
 */
export const buildTeamConversationPromptFromTemplate = (
  template: string,
  input: BuildTeamConversationPromptInput,
): string => renderPromptTemplate(template, buildTeamConversationPromptVars(input));
