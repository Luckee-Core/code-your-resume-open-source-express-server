import type { SupabaseClient } from '@supabase/supabase-js';
import { getCompanyFromStore } from '../../data/crm';
import { getJobFromStore } from '../../data/crm';
import { getProfessionalBackground } from '../../data/professional-background/get-professional-background';
import type { SegmentsRecord } from '../../data/professional-background/normalize-segments-from-json';
import { listTechnicalSkills } from '../../data/technical-skills/list-technical-skills';
import { loadJobBulletBodiesFromSupabase } from '../../utils/job/load-job-bullet-bodies-from-supabase';
import { buildSkillPromptLines } from '../../utils/technical-skills/build-skill-prompt-lines';

export type JobGenerationContext = {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves: string[];
  skillPromptLines: string[];
  professionalBackgroundSegments: SegmentsRecord;
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
 * Loads job, company, bullets, active skills, and professional background for generate APIs.
 *
 * @param supabase - Supabase service-role client
 * @param jobId - CRM job id
 * @returns Assembled generation context
 */
export const loadJobGenerationContext = async (
  supabase: SupabaseClient,
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

  const [respBodies, reqBodies, nthBodies, background, skillRows] = await Promise.all([
    loadJobBulletBodiesFromSupabase(supabase, trimmedJobId, 'job_responsibilities'),
    loadJobBulletBodiesFromSupabase(supabase, trimmedJobId, 'job_requirements'),
    loadJobBulletBodiesFromSupabase(supabase, trimmedJobId, 'job_nice_to_have'),
    getProfessionalBackground(supabase),
    listTechnicalSkills(supabase),
  ]);

  return {
    jobId: trimmedJobId,
    jobTitle: job.title.trim() || 'Untitled role',
    companyName: company?.name?.trim() || undefined,
    responsibilities: respBodies.length ? respBodies : job.responsibilities ?? [],
    requirements: reqBodies.length ? reqBodies : job.requirements ?? [],
    niceToHaves: nthBodies.length ? nthBodies : job.niceToHaves ?? [],
    skillPromptLines: buildSkillPromptLines(skillRows),
    professionalBackgroundSegments: background.segments,
  };
};

/**
 * Ensures professional background has credibility bio or voice style for letter-style generation.
 */
export const assertHasBackgroundVoice = (context: JobGenerationContext): void => {
  const credibility = context.professionalBackgroundSegments.credibility_bio?.trim() ?? '';
  const voice = context.professionalBackgroundSegments.voice_style?.trim() ?? '';
  if (!credibility && !voice) {
    throw new JobGenerationContextError(
      'professionalBackgroundSegments must include non-empty credibility_bio or voice_style',
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
