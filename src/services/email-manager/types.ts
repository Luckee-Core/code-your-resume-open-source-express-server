/** Row from email-manager GET /api/data/email-sync-tasks */
export type EmailManagerSyncTask = {
  id: string;
  name: string | null;
  mailbox_email: string;
  sender_filter: string;
  lookback_hours: number;
  schedule_interval_hours: number;
  enabled: boolean;
  last_run_at: string | null;
  gmail_connection_id: string | null;
  created_at: string;
  updated_at: string;
};

/** Result from email-manager POST /api/data/email-sync-tasks/:id/run */
export type EmailManagerSyncTaskRunResult = {
  syncTaskId: string;
  syncRunId: string;
  status: 'completed' | 'failed';
  messagesFound: number;
  messagesStored: number;
  errorMessage?: string;
};

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
