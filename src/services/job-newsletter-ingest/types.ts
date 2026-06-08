export type InboundNewsletterEmail = {
  gmailMessageId: string;
  fromEmail?: string | null;
  fromName?: string | null;
  subject?: string | null;
  receivedAt?: string | null;
  bodyText?: string | null;
  bodyHtml?: string | null;
};

export type ParsedNewsletterJobListing = {
  title: string;
  companyName: string;
  url: string;
  description: string;
  salary?: string | null;
};

export type JobNewsletterIngestJobResult = {
  title: string;
  companyName: string;
  url: string;
  jobId?: string;
  status: 'created' | 'skipped_duplicate' | 'skipped_no_url';
};

export type JobNewsletterIngestEmailStatus =
  | 'processed'
  | 'skipped_no_source'
  | 'skipped_disabled'
  | 'skipped_no_content'
  | 'parse_error';

export type JobNewsletterIngestEmailResult = {
  gmailMessageId: string;
  status: JobNewsletterIngestEmailStatus;
  sourceId?: string;
  sourceName?: string;
  listingsFound: number;
  jobs: JobNewsletterIngestJobResult[];
  parseSource: 'html' | 'text' | 'none';
  parseError?: string;
};

export type JobNewsletterIngestResult = {
  emailsProcessed: number;
  listingsFound: number;
  jobsCreated: number;
  jobsSkipped: number;
  companiesCreated: number;
  emailResults: JobNewsletterIngestEmailResult[];
};
