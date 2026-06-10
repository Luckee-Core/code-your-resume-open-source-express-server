import { randomUUID } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getCursorClient } from '../cursor';
import { pollAgentStatus } from '../cursor/poll-agent-status';
import { extractTsxFromConversation } from '../cursor/extract-tsx-from-conversation';
import { CRM_AI_FLOW_PROMPT_FLOWS } from '../../constants/crm-ai-flow-prompt-flows';
import { loadCrmGenerationPromptTemplate } from '../../utils/ai/load-crm-generation-prompt-template';
import { buildTeamConversationPromptFromTemplate } from './build-team-conversation-prompt';
import {
  insertTeamConversationRequest,
  insertTeamConversationExchange,
  insertTeamConversationResponse,
  updateTeamConversationExchangeCompleted,
  updateTeamConversationExchangeFailed,
  updateTeamConversationRequestCompleted,
  updateTeamConversationRequestFailed,
} from '../../data/team-conversation-generation';

export type RunTeamConversationGenerationInput = {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves?: string[];
  canvasWidthPx?: number;
  canvasHeightPx?: number;
  professionalBackgroundSegments: {
    education: string;
    credibility_bio: string;
    voice_style: string;
    portfolio_github: string;
  };
  skills?: string[];
};

export type RunTeamConversationGenerationResult = {
  tsx: string;
  agentId: string;
  requestId: string;
  exchangeId: string;
};

/** US Letter width at 96dpi. */
const DEFAULT_CANVAS_WIDTH = 816;
/** Short conversational answer block — same footprint as company interest. */
const DEFAULT_CANVAS_HEIGHT = 480;

const TEAM_CONVERSATION_COMPONENT_NAME = 'GeneratedTeamConversationPreview';

/**
 * Run the team-conversation generation pipeline: prompt → ledger → Cursor → extract TSX.
 *
 * @param supabase - Supabase service-role client for ledger writes
 * @param input - Job context, background segments, optional skills
 * @returns Generated TSX string and ledger IDs
 */
export const runTeamConversationGeneration = async (
  supabase: SupabaseClient,
  input: RunTeamConversationGenerationInput,
): Promise<RunTeamConversationGenerationResult> => {
  const {
    jobId,
    jobTitle,
    companyName,
    responsibilities,
    requirements,
    niceToHaves,
    canvasWidthPx = DEFAULT_CANVAS_WIDTH,
    canvasHeightPx = DEFAULT_CANVAS_HEIGHT,
    professionalBackgroundSegments,
    skills = [],
  } = input;

  const targetRepo = process.env.CURSOR_TARGET_REPO?.trim();
  if (!targetRepo) {
    throw new Error('CURSOR_TARGET_REPO environment variable is not set');
  }

  const cursorClient = getCursorClient();
  const requestId = randomUUID();
  let exchangeId: string | undefined;

  try {
    const template = await loadCrmGenerationPromptTemplate(
      supabase,
      CRM_AI_FLOW_PROMPT_FLOWS.TEAM_CONVERSATION_GENERATION,
    );
    const prompt = buildTeamConversationPromptFromTemplate(template, {
      jobId,
      jobTitle,
      companyName,
      responsibilities,
      requirements,
      niceToHaves,
      canvasWidthPx,
      canvasHeightPx,
      professionalBackgroundSegments,
      skills,
    });

    await insertTeamConversationRequest(supabase, {
      id: requestId,
      jobId,
      skills,
      canvasWidthPx,
      canvasHeightPx,
      promptText: prompt,
    });

    console.log(`🚀 Launching Cursor agent for team conversation — job: ${jobTitle} (${jobId})`);

    const agent = await cursorClient.launchAgent({
      prompt: { text: prompt },
      source: { repository: targetRepo, ref: 'main' },
      target: { autoCreatePr: false },
    });

    exchangeId = randomUUID();
    const exchangeStartTime = Date.now();

    await insertTeamConversationExchange(supabase, {
      id: exchangeId,
      jobId,
      requestId,
      agentId: agent.id,
    });

    const finalRun = await pollAgentStatus(cursorClient, agent.id, agent.runId);

    const tsx = await extractTsxFromConversation(cursorClient, agent.id, agent.runId, {
      expectedComponentName: TEAM_CONVERSATION_COMPONENT_NAME,
    });

    const responseId = randomUUID();
    await insertTeamConversationResponse(supabase, {
      id: responseId,
      tsxCode: tsx,
      agentSummary: finalRun.result ?? null,
    });

    const durationSeconds = Math.round((Date.now() - exchangeStartTime) / 1000);

    await updateTeamConversationExchangeCompleted(supabase, {
      id: exchangeId,
      responseId,
      inputTokens: 0,
      outputTokens: 0,
      modelUsed: process.env.CURSOR_AGENT_MODEL?.trim() || 'cursor-agent',
    });

    await updateTeamConversationRequestCompleted(supabase, requestId);

    console.log(`✅ Team conversation generation complete (${durationSeconds}s)`);

    return { tsx, agentId: agent.id, requestId, exchangeId };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    try {
      if (exchangeId) {
        await updateTeamConversationExchangeFailed(supabase, exchangeId, err.message);
      }
      await updateTeamConversationRequestFailed(supabase, requestId);
    } catch (updateError) {
      console.error('❌ Failed to update ledger on error:', updateError);
    }

    throw err;
  }
};
