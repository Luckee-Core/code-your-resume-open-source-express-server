import type { LinkedInEducation } from '../../data/linkedin-educations/types';
import type { LinkedInProfile } from '../../data/linkedin-profiles/types';

export type BuildCandidateIdentityPromptSectionInput = {
  profile: LinkedInProfile | null;
  educations: LinkedInEducation[];
  jobTitle: string;
};

const formatEducationLine = (row: LinkedInEducation): string => {
  const parts: string[] = [];
  if (row.degree?.trim()) parts.push(row.degree.trim());
  if (row.fieldOfStudy?.trim()) parts.push(row.fieldOfStudy.trim());
  const credential = parts.length > 0 ? parts.join(', ') : 'Education';
  const school = row.schoolName?.trim() || 'Unknown school';
  const year =
    row.endYear != null && String(row.endYear).trim() !== ''
      ? ` (${row.endYear})`
      : row.period?.trim()
        ? ` (${row.period.trim()})`
        : '';
  return `${credential}, ${school}${year}`;
};

/**
 * Resolve candidate full name from the tenant LinkedIn profile.
 */
export const resolveCandidateFullName = (input: BuildCandidateIdentityPromptSectionInput): string =>
  input.profile?.name?.trim() ?? '';

/**
 * Mandatory header identity block for resume generation — prevents copying OSS demo names (e.g. Alex Chen).
 */
export const buildCandidateIdentityPromptSection = (
  input: BuildCandidateIdentityPromptSectionInput,
): string => {
  const fullName = resolveCandidateFullName(input);
  if (!fullName) {
    throw new Error('Tenant LinkedIn profile name is required for resume generation');
  }

  const jobTitle = input.jobTitle.trim() || 'Untitled role';
  const location = input.profile?.location?.trim() ?? '';
  const linkedInHeadline = input.profile?.headline?.trim() ?? '';

  const headerSubline = location ? `${jobTitle} · ${location}` : jobTitle;
  const linkedInHeadlineNote = linkedInHeadline
    ? `\n**Do NOT** use the LinkedIn headline ("${linkedInHeadline}") as the header subline or executive summary opener.`
    : '';

  const educationLines = input.educations
    .map(formatEducationLine)
    .filter(Boolean);

  const educationBlock =
    educationLines.length > 0
      ? `\n**Education (use when rendering Education section):**\n${educationLines.map((line) => `- ${line}`).join('\n')}\n`
      : '';

  return `## Candidate identity (mandatory — overrides demo/placeholder names)

The resume header **name line MUST be exactly:** **${fullName}**

**Header subline (mandatory):** The one line directly under the name MUST be exactly: **${headerSubline}** (job posting title${location ? ' + location' : ''} — not LinkedIn headline).${linkedInHeadlineNote}

**Forbidden:** "Alex Chen", "Demo Candidate", or any name copied from \`src/packages/graphics-studio/builder-column/hold-components/ai-skills.tsx\` or other OSS demo files.

${educationBlock}`;
};
