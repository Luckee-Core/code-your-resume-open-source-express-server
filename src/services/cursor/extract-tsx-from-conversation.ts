import type { CursorApiClient } from './cursor-api-client';

/**
 * Fetch the agent conversation and extract the TSX component code from the last
 * assistant message that contains a fenced code block.
 *
 * Looks for ```tsx, ```typescript, or ```jsx blocks in reverse message order
 * so the most recent generated code is returned.
 *
 * @param cursorClient - Authenticated Cursor API client
 * @param agentId - ID of the finished agent
 * @returns Extracted TSX source string
 * @throws Error if no code block is found in the conversation
 */
export const extractTsxFromConversation = async (
  cursorClient: CursorApiClient,
  agentId: string,
): Promise<string> => {
  console.log(`📥 Fetching conversation for agent ${agentId}`);
  const conversation = await cursorClient.getAgentConversation(agentId);

  const assistantMessages = conversation.messages
    .filter((m) => m.type === 'assistant_message')
    .reverse();

  const codeBlockRegex = /```(?:tsx|typescript|ts|jsx|js)\n([\s\S]*?)```/;

  for (const message of assistantMessages) {
    const match = codeBlockRegex.exec(message.text);
    if (match) {
      const tsx = match[1].trim();
      console.log(`✅ Extracted TSX from agent conversation (${tsx.length} chars)`);
      return tsx;
    }
  }

  throw new Error(
    'No TSX code block found in agent conversation. The agent may not have output the component code directly.',
  );
};
