import { randomUUID } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getCursorClient } from '../cursor';
import { pollAgentStatus } from '../cursor/poll-agent-status';
import { extractTsxFromConversation } from '../cursor/extract-tsx-from-conversation';
import { CRM_AI_FLOW_PROMPT_FLOWS } from '../../constants/crm-ai-flow-prompt-flows';
import { loadCrmGenerationPromptTemplate } from '../../utils/ai/load-crm-generation-prompt-template';
import { buildIdealCandidatePromptFromTemplate } from './build-ideal-candidate-prompt';
import {
  insertIdealCandidateRequest,
  insertIdealCandidateExchange,
  insertIdealCandidateResponse,
  updateIdealCandidateExchangeCompleted,
  updateIdealCandidateExchangeFailed,
  updateIdealCandidateRequestCompleted,
  updateIdealCandidateRequestFailed,
} from '../../data/ideal-candidate-generation';

export type RunIdealCandidateGenerationInput = {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves?: string[];
  canvasWidthPx?: number;
  canvasHeightPx?: number;
  voiceStyle: string;
  projectsBlock: string;
  skills?: string[];
  appendedPromptSections?: string;
};

export type RunIdealCandidateGenerationResult = {
  tsx: string;
  agentId: string;
  requestId: string;
  exchangeId: string;
};

/** US Letter width at 96dpi. */
const DEFAULT_CANVAS_WIDTH = 816;
/** Half-page answer block. */
const DEFAULT_CANVAS_HEIGHT = 480;

const IDEAL_CANDIDATE_COMPONENT_NAME = 'GeneratedIdealCandidatePreview';

/**
 * Run the ideal-candidate generation pipeline: prompt → ledger → Cursor → extract TSX.
 *
 * @param supabase - Supabase service-role client for ledger writes
 * @param input - Job context, background segments, optional skills
 * @returns Generated TSX string and ledger IDs
 */
export const runIdealCandidateGeneration = async (
  supabase: SupabaseClient,
  input: RunIdealCandidateGenerationInput,
): Promise<RunIdealCandidateGenerationResult> => {
  const {
    jobId,
    jobTitle,
    companyName,
    responsibilities,
    requirements,
    niceToHaves,
    canvasWidthPx = DEFAULT_CANVAS_WIDTH,
    canvasHeightPx = DEFAULT_CANVAS_HEIGHT,
    voiceStyle,
    projectsBlock,
    skills = [],
    appendedPromptSections,
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
      CRM_AI_FLOW_PROMPT_FLOWS.IDEAL_CANDIDATE_GENERATION,
    );
    const promptBase = buildIdealCandidatePromptFromTemplate(template, {
      jobId,
      jobTitle,
      companyName,
      responsibilities,
      requirements,
      niceToHaves,
      canvasWidthPx,
      canvasHeightPx,
      voiceStyle,
      projectsBlock,
      skills,
    });
    const prompt = appendedPromptSections?.trim()
      ? `${promptBase}\n\n${appendedPromptSections.trim()}`
      : promptBase;

    await insertIdealCandidateRequest(supabase, {
      id: requestId,
      jobId,
      skills,
      canvasWidthPx,
      canvasHeightPx,
      promptText: prompt,
    });

    console.log(`🚀 Launching Cursor agent for ideal candidate — job: ${jobTitle} (${jobId})`);

    const agent = await cursorClient.launchAgent({
      prompt: { text: prompt },
      source: { repository: targetRepo, ref: 'main' },
      target: { autoCreatePr: false },
    });

    exchangeId = randomUUID();
    const exchangeStartTime = Date.now();

    await insertIdealCandidateExchange(supabase, {
      id: exchangeId,
      jobId,
      requestId,
      agentId: agent.id,
    });

    const finalRun = await pollAgentStatus(cursorClient, agent.id, agent.runId);

    const tsx = await extractTsxFromConversation(cursorClient, agent.id, agent.runId, {
      expectedComponentName: IDEAL_CANDIDATE_COMPONENT_NAME,
    });

    const responseId = randomUUID();
    await insertIdealCandidateResponse(supabase, {
      id: responseId,
      tsxCode: tsx,
      agentSummary: finalRun.result ?? null,
    });

    const durationSeconds = Math.round((Date.now() - exchangeStartTime) / 1000);

    await updateIdealCandidateExchangeCompleted(supabase, {
      id: exchangeId,
      responseId,
      inputTokens: 0,
      outputTokens: 0,
      modelUsed: agent.modelId,
    });

    await updateIdealCandidateRequestCompleted(supabase, requestId);

    console.log(`✅ Ideal candidate generation complete (${durationSeconds}s)`);

    return { tsx, agentId: agent.id, requestId, exchangeId };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    try {
      if (exchangeId) {
        await updateIdealCandidateExchangeFailed(supabase, exchangeId, err.message);
      }
      await updateIdealCandidateRequestFailed(supabase, requestId);
    } catch (updateError) {
      console.error('❌ Failed to update ledger on error:', updateError);
    }

    throw err;
  }
};
