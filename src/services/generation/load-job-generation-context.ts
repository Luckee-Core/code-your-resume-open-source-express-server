import type { Pool } from 'pg';
import { getCompanyFromStore } from '../../data/crm';
import { getJobFromStore } from '../../data/crm';
import { getVoiceStyle } from '../../data/voice-style/get-voice-style';
import { listTechnicalSkills } from '../../data/technical-skills/list-technical-skills';
import { listProjects } from '../../data/projects';
import { listAllProjectNotes } from '../../data/project-notes';
import { getTenantLinkedInProfile } from '../../data/linkedin-profiles';
import { listLinkedInEducationsByProfileId } from '../../data/linkedin-educations';
import { listSectionBodiesByJobId } from '../../data/job-listing-sections';
import { buildSkillPromptLines } from '../../utils/technical-skills/build-skill-prompt-lines';
import { buildProjectsPromptBlock, EMPTY_PROJECTS_LABEL, buildExperienceEmployersPromptSection } from '../../utils/projects';
import {
  buildCandidateIdentityPromptSection,
  resolveCandidateFullName,
} from './build-candidate-identity-prompt-section';
import { buildAppendedGenerationPromptSections } from './build-appended-generation-prompt-sections';

export type JobGenerationContext = {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves: string[];
  skillPromptLines: string[];
  voiceStyle: string;
  projectsBlock: string;
  candidateFullName: string;
  candidateIdentitySection: string;
  experienceEmployersSection: string;
  appendedPromptSections: string;
};

export class JobGenerationContextError extends Error {
  readonly statusCode: 400 | 404;

  constructor(message: string, statusCode: 400 | 404) {
    super(message);
    this.name = 'JobGenerationContextError';
    this.statusCode = statusCode;
  }
};

/**
 * Loads job, company, bullets, active skills, voice style, and projects for generate APIs.
 *
 * @param pool - Supabase service-role client
 * @param jobId - CRM job id
 * @returns Assembled generation context
 */
export const loadJobGenerationContext = async (
  pool: Pool,
  jobId: string,
): Promise<JobGenerationContext> => {
  const trimmedJobId = jobId.trim();
  if (!trimmedJobId) {
    throw new JobGenerationContextError('jobId is required', 400);
  }

  const job = await getJobFromStore(trimmedJobId);
  if (!job) {
    throw new JobGenerationContextError(`Job not found: ${trimmedJobId}`, 404);
  }

  const company =
    job.companyId.trim() !== '' ? await getCompanyFromStore(job.companyId) : null;

  const [respBodies, reqBodies, nthBodies, voiceStyleRow, skillRows, projectRows, projectNotes, tenantProfile] =
    await Promise.all([
    listSectionBodiesByJobId(pool, trimmedJobId, 'job_responsibilities'),
    listSectionBodiesByJobId(pool, trimmedJobId, 'job_requirements'),
    listSectionBodiesByJobId(pool, trimmedJobId, 'job_nice_to_have'),
    getVoiceStyle(pool),
    listTechnicalSkills(pool),
    listProjects(pool),
    listAllProjectNotes(pool),
    getTenantLinkedInProfile(pool),
  ]);

  const educations = tenantProfile
    ? await listLinkedInEducationsByProfileId(pool, tenantProfile.id)
    : [];

  const candidateIdentityInput = {
    profile: tenantProfile,
    educations,
    jobTitle: job.title.trim() || 'Untitled role',
  };
  const candidateFullName = resolveCandidateFullName(candidateIdentityInput);
  const candidateIdentitySection = candidateFullName
    ? buildCandidateIdentityPromptSection(candidateIdentityInput)
    : '';
  const experienceEmployersSection = buildExperienceEmployersPromptSection(projectRows);
  const appendedPromptSections = buildAppendedGenerationPromptSections([
    candidateIdentitySection,
    experienceEmployersSection,
  ]);

  return {
    jobId: trimmedJobId,
    jobTitle: job.title.trim() || 'Untitled role',
    companyName: company?.name?.trim() || undefined,
    responsibilities: respBodies.length ? respBodies : job.responsibilities ?? [],
    requirements: reqBodies.length ? reqBodies : job.requirements ?? [],
    niceToHaves: nthBodies.length ? nthBodies : job.niceToHaves ?? [],
    skillPromptLines: buildSkillPromptLines(skillRows),
    voiceStyle: voiceStyleRow.body,
    projectsBlock: buildProjectsPromptBlock(projectRows, projectNotes),
    candidateFullName,
    candidateIdentitySection,
    experienceEmployersSection,
    appendedPromptSections,
  };
};

/**
 * Ensures projects or voice style exist for letter-style generation.
 */
export const assertHasNarrativeContext = (context: JobGenerationContext): void => {
  const hasProjects =
    context.projectsBlock.trim() !== '' &&
    context.projectsBlock.trim() !== EMPTY_PROJECTS_LABEL;
  const hasVoice = context.voiceStyle.trim() !== '';
  if (!hasProjects && !hasVoice) {
    throw new JobGenerationContextError(
      'Add at least one project in Projects studio or voice style notes before generating',
      400,
    );
  }
};

/**
 * Ensures tenant LinkedIn profile has a name for resume generation.
 */
export const assertHasCandidateName = (context: JobGenerationContext): void => {
  if (!context.candidateFullName.trim()) {
    throw new JobGenerationContextError(
      'Sync My LinkedIn with your profile name before generating a resume',
      400,
    );
  }
};

/**
 * Ensures at least one active technical skill exists for resume generation.
 */
export const assertHasActiveSkills = (context: JobGenerationContext): void => {
  if (context.skillPromptLines.length === 0) {
    throw new JobGenerationContextError(
      'At least one active technical skill is required to generate a resume',
      400,
    );
  }
};
