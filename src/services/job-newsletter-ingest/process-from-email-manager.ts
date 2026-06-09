import {
  listFetchedEmailsFromEmailManager,
  markFetchedEmailsProcessedInEmailManager,
} from '../email-manager';
import { mapEmailManagerFetchedEmailToInbound } from './map-email-manager-fetched-email-to-inbound';
import { processJobNewsletterIngest } from './process-job-newsletter-ingest';
import type { JobNewsletterIngestResult } from './types';

export type ProcessJobNewslettersFromEmailManagerInput = {
  syncTaskId?: string;
};

/**
 * Pull unprocessed emails from email-manager, parse with AI, and ingest CRM jobs.
 */
export const processJobNewslettersFromEmailManager = async (
  input: ProcessJobNewslettersFromEmailManagerInput = {},
): Promise<JobNewsletterIngestResult> => {
  console.log('🚀 processJobNewslettersFromEmailManager', input);

  const fetched = await listFetchedEmailsFromEmailManager({
    syncTaskId: input.syncTaskId,
    unprocessedOnly: true,
  });

  if (fetched.length === 0) {
    console.log('✅ processJobNewslettersFromEmailManager — no unprocessed emails');
    return {
      emailsProcessed: 0,
      listingsFound: 0,
      jobsCreated: 0,
      jobsSkipped: 0,
      companiesCreated: 0,
      emailResults: [],
    };
  }

  const emails = fetched.map(mapEmailManagerFetchedEmailToInbound);
  const result = await processJobNewsletterIngest({ emails });

  const processedIds = fetched
    .filter((_row, index) => result.emailResults[index]?.status === 'processed')
    .map((row) => row.id);

  if (processedIds.length > 0) {
    await markFetchedEmailsProcessedInEmailManager(processedIds);
  }

  console.log('✅ processJobNewslettersFromEmailManager complete', {
    fetched: fetched.length,
    jobsCreated: result.jobsCreated,
  });

  return result;
};
