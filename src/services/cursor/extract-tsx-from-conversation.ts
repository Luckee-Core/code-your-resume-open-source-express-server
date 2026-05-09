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

  const codeBlockRegex = /```(?:tsx|typescript|ts|jsx|js)?\r?\n([\s\S]*?)```/g;

  const looksLikeResumeComponent = (text: string): boolean => {
    return (
      text.includes('"use client"') &&
      text.includes('export default function GeneratedSkillsPreview')
    );
  };

  for (const message of assistantMessages) {
    const blocks = [...message.text.matchAll(codeBlockRegex)];
    for (let i = blocks.length - 1; i >= 0; i--) {
      const candidate = (blocks[i][1] ?? '').trim();
      if (!candidate) {
        continue;
      }
      if (looksLikeResumeComponent(candidate)) {
        console.log(`✅ Extracted TSX from fenced block (${candidate.length} chars)`);
        return candidate;
      }
    }

    // Fallback: sometimes the agent responds with plain code (no fences).
    const plainCandidate = message.text.trim();
    if (looksLikeResumeComponent(plainCandidate)) {
      console.log(`✅ Extracted TSX from plain assistant message (${plainCandidate.length} chars)`);
      return plainCandidate;
    }
  }

  throw new Error(
    'No TSX code block found in agent conversation. The agent may not have output the component code directly.',
  );
};
