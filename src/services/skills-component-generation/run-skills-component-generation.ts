import { randomUUID } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getCursorClient } from '../cursor';
import { pollAgentStatus } from '../cursor/poll-agent-status';
import { extractTsxFromConversation } from '../cursor/extract-tsx-from-conversation';
import { CRM_AI_FLOW_PROMPT_FLOWS } from '../../constants/crm-ai-flow-prompt-flows';
import { loadCrmGenerationPromptTemplate } from '../../utils/ai/load-crm-generation-prompt-template';
import { buildSkillsComponentPromptFromTemplate } from './build-skills-component-prompt';
import {
  insertSkillsComponentRequest,
  insertSkillsComponentExchange,
  insertSkillsComponentResponse,
  updateSkillsComponentExchangeCompleted,
  updateSkillsComponentExchangeFailed,
  updateSkillsComponentRequestCompleted,
  updateSkillsComponentRequestFailed,
} from '../../data/skills-component-generation';

export type RunSkillsComponentGenerationInput = {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves?: string[];
  skills: string[];
  canvasWidthPx?: number;
  canvasHeightPx?: number;
  professionalBackgroundSegments?: {
    education: string;
    credibility_bio: string;
    voice_style: string;
    portfolio_github: string;
  };
};

export type RunSkillsComponentGenerationResult = {
  tsx: string;
  agentId: string;
  requestId: string;
  exchangeId: string;
};

/** US Letter width at 96dpi. */
const DEFAULT_CANVAS_WIDTH = 816;
/** Minimum resume canvas height at generation time; client preview grows to fit content. */
const DEFAULT_CANVAS_HEIGHT = 1150;

/**
 * Run the full skills component generation pipeline:
 * 1. Build prompt from skills + canvas dimensions
 * 2. Insert ledger request (pending)
 * 3. Launch Cursor agent against the open-source repo
 * 4. Insert ledger exchange (running)
 * 5. Poll agent until finished
 * 6. Extract TSX from agent conversation
 * 7. Insert ledger response (tsx_code + summary)
 * 8. Update exchange (completed + metrics)
 * 9. Update request (completed)
 * 10. Return tsx string
 *
 * On any failure, updates exchange + request to failed before re-throwing.
 *
 * @param supabase - Supabase service-role client for ledger writes
 * @param input - Skills list and optional canvas dimensions
 * @returns Generated TSX string and ledger IDs
 */
export const runSkillsComponentGeneration = async (
  supabase: SupabaseClient,
  input: RunSkillsComponentGenerationInput,
): Promise<RunSkillsComponentGenerationResult> => {
  const {
    jobId,
    jobTitle,
    companyName,
    responsibilities,
    requirements,
    niceToHaves,
    skills,
    canvasWidthPx = DEFAULT_CANVAS_WIDTH,
    canvasHeightPx = DEFAULT_CANVAS_HEIGHT,
    professionalBackgroundSegments,
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
      CRM_AI_FLOW_PROMPT_FLOWS.SKILLS_COMPONENT_GENERATION,
    );
    const prompt = buildSkillsComponentPromptFromTemplate(template, {
      jobId: jobId.trim(),
      jobTitle,
      companyName,
      responsibilities,
      requirements,
      niceToHaves,
      skills,
      canvasWidthPx,
      canvasHeightPx,
      professionalBackgroundSegments,
    });

    await insertSkillsComponentRequest(supabase, {
      id: requestId,
      jobId,
      skills,
      canvasWidthPx,
      canvasHeightPx,
      promptText: prompt,
    });

    console.log(
      `🚀 Launching Cursor agent for skills (job ${jobId}): ${skills.join(', ')}`,
    );

    const agent = await cursorClient.launchAgent({
      prompt: { text: prompt },
      source: { repository: targetRepo, ref: 'main' },
      target: { autoCreatePr: false },
    });

    exchangeId = randomUUID();
    const exchangeStartTime = Date.now();

    await insertSkillsComponentExchange(supabase, {
      id: exchangeId,
      jobId,
      requestId,
      agentId: agent.id,
    });

    const finalRun = await pollAgentStatus(cursorClient, agent.id, agent.runId);

    const tsx = await extractTsxFromConversation(cursorClient, agent.id, agent.runId);

    const responseId = randomUUID();
    await insertSkillsComponentResponse(supabase, {
      id: responseId,
      tsxCode: tsx,
      agentSummary: finalRun.result ?? null,
    });

    const durationSeconds = Math.round((Date.now() - exchangeStartTime) / 1000);

    await updateSkillsComponentExchangeCompleted(supabase, {
      id: exchangeId,
      responseId,
      inputTokens: 0,
      outputTokens: 0,
      modelUsed: process.env.CURSOR_AGENT_MODEL?.trim() || 'cursor-agent',
    });

    await updateSkillsComponentRequestCompleted(supabase, requestId);

    console.log(`✅ Skills component generation complete (${durationSeconds}s)`);

    return { tsx, agentId: agent.id, requestId, exchangeId };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    try {
      if (exchangeId) {
        await updateSkillsComponentExchangeFailed(supabase, exchangeId, err.message);
      }
      await updateSkillsComponentRequestFailed(supabase, requestId);
    } catch (updateError) {
      console.error('❌ Failed to update ledger on error:', updateError);
    }

    throw err;
  }
};
