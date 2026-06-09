import type {
  EmailManagerFetchedEmail,
  ListFetchedEmailsFromEmailManagerInput,
} from './types';

type ExpressListResponse = {
  success: boolean;
  data?: EmailManagerFetchedEmail[];
  error?: string;
};

const getEmailManagerBaseUrl = (): string => {
  const baseUrl = process.env.EMAIL_MANAGER_EXPRESS_URL?.trim();
  if (!baseUrl) {
    throw new Error('EMAIL_MANAGER_EXPRESS_URL is not configured');
  }
  return baseUrl.replace(/\/$/, '');
};

/**
 * List fetched emails from email-manager Express.
 */
export const listFetchedEmailsFromEmailManager = async (
  input: ListFetchedEmailsFromEmailManagerInput = {},
): Promise<EmailManagerFetchedEmail[]> => {
  const params = new URLSearchParams();
  if (input.syncTaskId) params.set('syncTaskId', input.syncTaskId);
  if (input.unprocessedOnly) params.set('unprocessedOnly', 'true');

  const query = params.toString();
  const url = `${getEmailManagerBaseUrl()}/api/data/fetched-emails${query ? `?${query}` : ''}`;

  const response = await fetch(url);
  const body = (await response.json()) as ExpressListResponse;

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error ?? `email-manager list failed (${response.status})`);
  }

  return body.data;
};

/**
 * Mark fetched emails as processed in CRM (sets forwarded_at on email-manager side).
 */
export const markFetchedEmailsProcessedInEmailManager = async (
  ids: string[],
): Promise<void> => {
  if (ids.length === 0) return;

  const url = `${getEmailManagerBaseUrl()}/api/data/fetched-emails/mark-processed`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });

  const body = (await response.json()) as { success: boolean; error?: string };
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? `email-manager mark-processed failed (${response.status})`);
  }
};
