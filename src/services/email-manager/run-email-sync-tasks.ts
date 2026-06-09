import { getEmailManagerBaseUrl } from './get-email-manager-base-url';
import type { EmailManagerSyncTask, EmailManagerSyncTaskRunResult } from './types';

type ExpressListResponse = {
  success: boolean;
  data?: EmailManagerSyncTask[];
  error?: string;
};

type ExpressRunResponse = {
  success: boolean;
  data?: EmailManagerSyncTaskRunResult;
  error?: string;
};

export type RunEmailSyncTasksFromEmailManagerInput = {
  syncTaskId?: string;
  /** Match email-manager sync task `sender_filter` (e.g. newsletter source sender). */
  senderFilter?: string;
};

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

/**
 * List enabled email sync tasks from email-manager, optionally filtered by sender.
 */
const listEnabledSyncTasksFromEmailManager = async (
  senderFilter?: string,
): Promise<EmailManagerSyncTask[]> => {
  const url = `${getEmailManagerBaseUrl()}/api/data/email-sync-tasks`;
  const response = await fetch(url);
  const body = (await response.json()) as ExpressListResponse;

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error ?? `email-manager sync-task list failed (${response.status})`);
  }

  const normalizedSender = senderFilter ? normalizeEmail(senderFilter) : undefined;

  return body.data.filter((task) => {
    if (!task.enabled) return false;
    if (!normalizedSender) return true;
    return normalizeEmail(task.sender_filter) === normalizedSender;
  });
};

/**
 * Run a single email sync task in email-manager (Gmail fetch + store).
 */
const runEmailSyncTaskInEmailManager = async (
  syncTaskId: string,
): Promise<EmailManagerSyncTaskRunResult> => {
  const url = `${getEmailManagerBaseUrl()}/api/data/email-sync-tasks/${syncTaskId}/run`;
  const response = await fetch(url, { method: 'POST' });
  const body = (await response.json()) as ExpressRunResponse;

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error ?? `email-manager sync run failed (${response.status})`);
  }

  return body.data;
};

/**
 * Trigger Gmail sync in email-manager before newsletter ingest.
 */
export const runEmailSyncTasksFromEmailManager = async (
  input: RunEmailSyncTasksFromEmailManagerInput = {},
): Promise<EmailManagerSyncTaskRunResult[]> => {
  console.log('🚀 runEmailSyncTasksFromEmailManager', input);

  if (input.syncTaskId) {
    const result = await runEmailSyncTaskInEmailManager(input.syncTaskId);
    console.log('✅ runEmailSyncTasksFromEmailManager — single task', result);
    return [result];
  }

  const tasks = await listEnabledSyncTasksFromEmailManager(input.senderFilter);
  if (tasks.length === 0) {
    console.log('✅ runEmailSyncTasksFromEmailManager — no matching enabled sync tasks');
    return [];
  }

  const results: EmailManagerSyncTaskRunResult[] = [];
  for (const task of tasks) {
    const result = await runEmailSyncTaskInEmailManager(task.id);
    results.push(result);
  }

  console.log('✅ runEmailSyncTasksFromEmailManager complete', {
    tasksRun: results.length,
    messagesStored: results.reduce((sum, row) => sum + row.messagesStored, 0),
  });

  return results;
};
