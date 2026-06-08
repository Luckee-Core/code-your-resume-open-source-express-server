import { createCompanyInStore, createJobInStore } from '../../data/crm';
import { findCompanyByNameFromSupabase } from '../../data/crm/supabase/find-company-by-name-from-supabase';
import { findJobByUrlFromSupabase } from '../../data/crm/supabase/find-job-by-url-from-supabase';
import { requireCrmSupabaseClient } from '../../data/crm/require-crm-supabase-client';
import { updateJobInStore } from '../../data/crm/update-job-in-store';
import { getJobNewsletterSourceBySenderEmail } from '../../data/job-newsletter-sources';
import { parseNewsletterEmailWithAi } from './parse-newsletter-email-with-ai';
import type {
  InboundNewsletterEmail,
  JobNewsletterIngestEmailResult,
  JobNewsletterIngestJobResult,
  JobNewsletterIngestResult,
  ParsedNewsletterJobListing,
} from './types';

export type ProcessJobNewsletterIngestInput = {
  emails: InboundNewsletterEmail[];
};

const buildJobDescription = (listing: ParsedNewsletterJobListing): string => {
  const parts: string[] = [];
  if (listing.salary) {
    parts.push(`Compensation: ${listing.salary}`);
  }
  if (listing.description) {
    parts.push(listing.description);
  }
  return parts.join('\n\n').trim();
};

const resolveCompanyId = async (
  companyName: string,
  sourceName: string,
  counters: { companiesCreated: number },
): Promise<string> => {
  const supabase = requireCrmSupabaseClient();
  const existing = await findCompanyByNameFromSupabase(supabase, companyName);
  if (existing) {
    return existing.id;
  }

  const created = await createCompanyInStore({
    name: companyName,
    website: '',
    notes: `Created from job newsletter ingest (${sourceName})`,
  });
  counters.companiesCreated += 1;
  return created.id;
};

const ingestListing = async (
  listing: ParsedNewsletterJobListing,
  sourceName: string,
  counters: { jobsCreated: number; jobsSkipped: number; companiesCreated: number },
): Promise<JobNewsletterIngestJobResult> => {
  const url = listing.url.trim();
  if (!url) {
    counters.jobsSkipped += 1;
    return {
      title: listing.title,
      companyName: listing.companyName,
      url: '',
      status: 'skipped_no_url',
    };
  }

  const supabase = requireCrmSupabaseClient();
  const existingJob = await findJobByUrlFromSupabase(supabase, url);
  if (existingJob) {
    counters.jobsSkipped += 1;
    return {
      title: listing.title,
      companyName: listing.companyName,
      url,
      jobId: existingJob.id,
      status: 'skipped_duplicate',
    };
  }

  const companyId = await resolveCompanyId(listing.companyName, sourceName, counters);
  const description = buildJobDescription(listing);

  const job = await createJobInStore({
    companyId,
    title: listing.title,
    url,
    status: 'draft',
  });

  await updateJobInStore(job.id, { description });

  counters.jobsCreated += 1;
  return {
    title: listing.title,
    companyName: listing.companyName,
    url,
    jobId: job.id,
    status: 'created',
  };
};

/**
 * Match forwarded emails to configured newsletter sources and ingest parsed job postings into CRM.
 */
export const processJobNewsletterIngest = async (
  input: ProcessJobNewsletterIngestInput,
): Promise<JobNewsletterIngestResult> => {
  console.log('🚀 processJobNewsletterIngest', { emailCount: input.emails.length });

  const supabase = requireCrmSupabaseClient();
  const counters = {
    jobsCreated: 0,
    jobsSkipped: 0,
    companiesCreated: 0,
  };

  const emailResults: JobNewsletterIngestEmailResult[] = [];
  let listingsFound = 0;

  for (const email of input.emails) {
    const fromEmail = email.fromEmail?.trim() ?? '';
    if (!fromEmail) {
      emailResults.push({
        gmailMessageId: email.gmailMessageId,
        status: 'skipped_no_source',
        listingsFound: 0,
        jobs: [],
        parseSource: 'none',
      });
      continue;
    }

    const source = await getJobNewsletterSourceBySenderEmail(supabase, fromEmail);
    if (!source) {
      emailResults.push({
        gmailMessageId: email.gmailMessageId,
        status: 'skipped_no_source',
        listingsFound: 0,
        jobs: [],
        parseSource: 'none',
      });
      continue;
    }

    if (!source.enabled) {
      emailResults.push({
        gmailMessageId: email.gmailMessageId,
        status: 'skipped_disabled',
        sourceId: source.id,
        sourceName: source.name,
        listingsFound: 0,
        jobs: [],
        parseSource: 'none',
      });
      continue;
    }

    const hasContent = Boolean(email.bodyHtml?.trim() || email.bodyText?.trim());
    if (!hasContent) {
      emailResults.push({
        gmailMessageId: email.gmailMessageId,
        status: 'skipped_no_content',
        sourceId: source.id,
        sourceName: source.name,
        listingsFound: 0,
        jobs: [],
        parseSource: 'none',
      });
      continue;
    }

    const parseSource: 'html' | 'text' | 'none' = email.bodyHtml?.trim()
      ? 'html'
      : email.bodyText?.trim()
        ? 'text'
        : 'none';

    const parseOutcome = await parseNewsletterEmailWithAi({
      sourceName: source.name,
      parseInstructions: source.parse_instructions,
      subject: email.subject,
      bodyHtml: email.bodyHtml,
      bodyText: email.bodyText,
    });

    if (parseOutcome.kind === 'skipped') {
      emailResults.push({
        gmailMessageId: email.gmailMessageId,
        status: 'parse_error',
        sourceId: source.id,
        sourceName: source.name,
        listingsFound: 0,
        jobs: [],
        parseSource: 'none',
        parseError: 'ANTHROPIC_API_KEY is not configured',
      });
      continue;
    }

    if (parseOutcome.kind === 'error') {
      emailResults.push({
        gmailMessageId: email.gmailMessageId,
        status: 'parse_error',
        sourceId: source.id,
        sourceName: source.name,
        listingsFound: 0,
        jobs: [],
        parseSource: parseSource === 'none' ? 'text' : parseSource,
        parseError: parseOutcome.message,
      });
      continue;
    }

    listingsFound += parseOutcome.jobs.length;
    const jobs: JobNewsletterIngestJobResult[] = [];
    for (const listing of parseOutcome.jobs) {
      jobs.push(await ingestListing(listing, source.name, counters));
    }

    emailResults.push({
      gmailMessageId: email.gmailMessageId,
      status: 'processed',
      sourceId: source.id,
      sourceName: source.name,
      listingsFound: parseOutcome.jobs.length,
      jobs,
      parseSource: parseOutcome.parseSource,
    });
  }

  console.log('✅ processJobNewsletterIngest complete', {
    emailsProcessed: input.emails.length,
    listingsFound,
    jobsCreated: counters.jobsCreated,
    jobsSkipped: counters.jobsSkipped,
    companiesCreated: counters.companiesCreated,
  });

  return {
    emailsProcessed: input.emails.length,
    listingsFound,
    jobsCreated: counters.jobsCreated,
    jobsSkipped: counters.jobsSkipped,
    companiesCreated: counters.companiesCreated,
    emailResults,
  };
};
