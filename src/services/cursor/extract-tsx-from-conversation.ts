import type { CursorApiClient } from './cursor-api-client';

export type ExtractTsxFromConversationOptions = {
  /** Default `GeneratedSkillsPreview` for skills/resume generation. */
  expectedComponentName?: string;
};

/**
 * Fetch the agent run result and extract the TSX component code from the assistant reply.
 *
 * Looks for ```tsx, ```typescript, or ```jsx blocks, or plain code matching the expected export.
 *
 * @param cursorClient - Authenticated Cursor API client
 * @param agentId - Durable agent ID
 * @param runId - Run ID from launchAgent
 * @param options - Optional expected default export function name
 * @returns Extracted TSX source string
 * @throws Error if no code block is found in the run result
 */
export const extractTsxFromConversation = async (
  cursorClient: CursorApiClient,
  agentId: string,
  runId: string,
  options?: ExtractTsxFromConversationOptions,
): Promise<string> => {
  const expectedComponentName = options?.expectedComponentName ?? 'GeneratedSkillsPreview';

  console.log(`📥 Fetching run result for agent ${agentId} run ${runId}`);
  const run = await cursorClient.getRun(agentId, runId);
  const resultText = run.result?.trim();

  if (!resultText) {
    throw new Error(
      'No assistant result found for agent run. The agent may not have output the component code directly.',
    );
  }

  const codeBlockRegex = /```(?:tsx|typescript|ts|jsx|js)?\r?\n([\s\S]*?)```/g;

  const looksLikeExpectedComponent = (text: string): boolean => {
    return (
      text.includes('"use client"') &&
      text.includes(`export default function ${expectedComponentName}`)
    );
  };

  const blocks = [...resultText.matchAll(codeBlockRegex)];
  for (let i = blocks.length - 1; i >= 0; i--) {
    const candidate = (blocks[i][1] ?? '').trim();
    if (!candidate) {
      continue;
    }
    if (looksLikeExpectedComponent(candidate)) {
      console.log(`✅ Extracted TSX from fenced block (${candidate.length} chars)`);
      return candidate;
    }
  }

  if (looksLikeExpectedComponent(resultText)) {
    console.log(`✅ Extracted TSX from plain run result (${resultText.length} chars)`);
    return resultText;
  }

  throw new Error(
    'No TSX code block found in agent run result. The agent may not have output the component code directly.',
  );
};
