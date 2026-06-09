import type { EmailManagerFetchedEmail } from '../email-manager';
import type { InboundNewsletterEmail } from './types';

/**
 * Map an email-manager fetched email row to newsletter ingest input.
 */
export const mapEmailManagerFetchedEmailToInbound = (
  email: EmailManagerFetchedEmail,
): InboundNewsletterEmail => ({
  gmailMessageId: email.gmail_message_id,
  fromEmail: email.from_email,
  fromName: email.from_name,
  subject: email.subject,
  receivedAt: email.received_at,
  bodyText: email.body_text,
  bodyHtml: email.body_html,
});
