import type { CursorApiClient, AgentRun } from './cursor-api-client';

const TERMINAL_STATUSES = new Set<AgentRun['status']>(['FINISHED', 'ERROR', 'CANCELLED', 'EXPIRED']);

/**
 * Poll a Cursor agent run until it reaches a terminal state or times out.
 *
 * @param cursorClient - Authenticated Cursor API client
 * @param agentId - Durable agent ID
 * @param runId - Run ID from launchAgent
 * @param maxWaitMs - Maximum wait time in milliseconds (default: 20 minutes)
 * @param pollIntervalMs - Interval between polls in milliseconds (default: 15 seconds)
 * @returns Final run state when FINISHED
 * @throws Error if run fails, is cancelled, or times out
 */
export const pollAgentStatus = async (
  cursorClient: CursorApiClient,
  agentId: string,
  runId: string,
  maxWaitMs: number = Number(process.env.CURSOR_AGENT_MAX_WAIT_MS || 20 * 60 * 1000),
  pollIntervalMs: number = Number(process.env.CURSOR_AGENT_POLL_INTERVAL_MS || 15000),
): Promise<AgentRun> => {
  const startTime = Date.now();

  while (true) {
    const run = await cursorClient.getRun(agentId, runId);

    console.log(`🔍 Agent ${agentId} run ${runId} status: ${run.status}`);

    if (run.status === 'FINISHED') {
      console.log(`✅ Agent ${agentId} run ${runId} finished successfully`);
      return run;
    }

    if (run.status === 'ERROR') {
      const errorMsg = run.result || 'Agent run failed without error message';
      console.error(`❌ Agent ${agentId} run ${runId} failed: ${errorMsg}`);
      throw new Error(`Code generation failed: ${errorMsg}`);
    }

    if (run.status === 'CANCELLED' || run.status === 'EXPIRED') {
      console.error(`⏸️ Agent ${agentId} run ${runId} ended with status ${run.status}`);
      throw new Error(`Code generation was ${run.status.toLowerCase()}`);
    }

    const elapsed = Date.now() - startTime;
    if (elapsed >= maxWaitMs) {
      console.error(`⏱️ Agent ${agentId} run ${runId} timed out after ${elapsed}ms`);
      throw new Error(`Code generation timed out after ${Math.round(elapsed / 1000)}s`);
    }

    if (!TERMINAL_STATUSES.has(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      continue;
    }

    throw new Error(`Code generation ended unexpectedly with status ${run.status}`);
  }
};
