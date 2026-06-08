import type { Request, Response } from 'express';
import {
  processJobNewsletterIngest,
  type InboundNewsletterEmail,
} from '../../../services/job-newsletter-ingest';

type Body = {
  emails?: unknown;
};

/**
 * Validate inbound email payload from email-manager forwarder.
 */
const parseInboundEmails = (raw: unknown): InboundNewsletterEmail[] | null => {
  if (!Array.isArray(raw)) return null;

  const emails: InboundNewsletterEmail[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const row = item as Record<string, unknown>;
    const gmailMessageId =
      typeof row.gmailMessageId === 'string' ? row.gmailMessageId.trim() : '';
    if (!gmailMessageId) return null;

    emails.push({
      gmailMessageId,
      fromEmail: typeof row.fromEmail === 'string' ? row.fromEmail : null,
      fromName: typeof row.fromName === 'string' ? row.fromName : null,
      subject: typeof row.subject === 'string' ? row.subject : null,
      receivedAt: typeof row.receivedAt === 'string' ? row.receivedAt : null,
      bodyText: typeof row.bodyText === 'string' ? row.bodyText : null,
      bodyHtml: typeof row.bodyHtml === 'string' ? row.bodyHtml : null,
    });
  }

  return emails;
};

/**
 * POST /api/job-newsletter-ingest/ingest — accept forwarded job newsletter emails.
 */
export const handleJobNewsletterIngest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('📥 POST /api/job-newsletter-ingest/ingest');

    const body = req.body as Body;
    const emails = parseInboundEmails(body.emails);

    if (!emails) {
      res.status(400).json({ success: false, error: 'emails must be a non-empty array' });
      return;
    }

    if (emails.length === 0) {
      res.status(400).json({ success: false, error: 'emails array is empty' });
      return;
    }

    const data = await processJobNewsletterIngest({ emails });

    console.log('📤 POST /api/job-newsletter-ingest/ingest');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ POST /api/job-newsletter-ingest/ingest:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to ingest job newsletter emails',
    });
  }
};
