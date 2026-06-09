/** Row from email-manager GET /api/data/fetched-emails */
export type EmailManagerFetchedEmail = {
  id: string;
  sync_task_id: string;
  gmail_message_id: string;
  from_email: string | null;
  from_name: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  received_at: string | null;
  forwarded_at: string | null;
};

export type ListFetchedEmailsFromEmailManagerInput = {
  syncTaskId?: string;
  unprocessedOnly?: boolean;
};
