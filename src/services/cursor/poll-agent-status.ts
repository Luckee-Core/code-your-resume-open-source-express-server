import type { CursorApiClient, Agent } from './cursor-api-client';

/**
 * Poll a Cursor agent until it reaches a terminal state or times out.
 *
 * @param cursorClient - Authenticated Cursor API client
 * @param agentId - Agent ID to poll
 * @param maxWaitMs - Maximum wait time in milliseconds (default: 10 minutes)
 * @param pollIntervalMs - Interval between polls in milliseconds (default: 30 seconds)
 * @returns Final agent state when FINISHED
 * @throws Error if agent fails, is stopped, or times out
 */
export const pollAgentStatus = async (
  cursorClient: CursorApiClient,
  agentId: string,
  maxWaitMs: number = 10 * 60 * 1000,
  pollIntervalMs: number = 30000,
): Promise<Agent> => {
  const startTime = Date.now();

  while (true) {
    const agent = await cursorClient.getAgent(agentId);

    console.log(`🔍 Agent ${agentId} status: ${agent.status}`);

    if (agent.status === 'FINISHED') {
      console.log(`✅ Agent ${agentId} finished successfully`);
      return agent;
    }

    if (agent.status === 'FAILED') {
      const errorMsg = agent.summary || 'Agent failed without error message';
      console.error(`❌ Agent ${agentId} failed: ${errorMsg}`);
      throw new Error(`Code generation failed: ${errorMsg}`);
    }

    if (agent.status === 'STOPPED') {
      console.error(`⏸️ Agent ${agentId} was stopped`);
      throw new Error('Code generation was stopped');
    }

    const elapsed = Date.now() - startTime;
    if (elapsed >= maxWaitMs) {
      console.error(`⏱️ Agent ${agentId} timed out after ${elapsed}ms`);
      throw new Error(`Code generation timed out after ${Math.round(elapsed / 1000)}s`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
};
