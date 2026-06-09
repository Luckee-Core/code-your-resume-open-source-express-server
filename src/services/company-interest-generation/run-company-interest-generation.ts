import { randomUUID } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getCursorClient } from '../cursor';
import { pollAgentStatus } from '../cursor/poll-agent-status';
import { extractTsxFromConversation } from '../cursor/extract-tsx-from-conversation';
import { CRM_AI_FLOW_PROMPT_FLOWS } from '../../constants/crm-ai-flow-prompt-flows';
import { loadCrmGenerationPromptTemplate } from '../../utils/ai/load-crm-generation-prompt-template';
import { buildCompanyInterestPromptFromTemplate } from './build-company-interest-prompt';
import {
  insertCompanyInterestRequest,
  insertCompanyInterestExchange,
  insertCompanyInterestResponse,
  updateCompanyInterestExchangeCompleted,
  updateCompanyInterestExchangeFailed,
  updateCompanyInterestRequestCompleted,
  updateCompanyInterestRequestFailed,
} from '../../data/company-interest-generation';

export type RunCompanyInterestGenerationInput = {
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

export type RunCompanyInterestGenerationResult = {
  tsx: string;
  agentId: string;
  requestId: string;
  exchangeId: string;
};

/** US Letter width at 96dpi. */
const DEFAULT_CANVAS_WIDTH = 816;
/** Shorter than cover letter — half-page answer block. */
const DEFAULT_CANVAS_HEIGHT = 480;

const COMPANY_INTEREST_COMPONENT_NAME = 'GeneratedCompanyInterestPreview';

/**
 * Run the company-interest generation pipeline: prompt → ledger → Cursor → extract TSX.
 *
 * @param supabase - Supabase service-role client for ledger writes
 * @param input - Job context, background segments, optional skills
 * @returns Generated TSX string and ledger IDs
 */
export const runCompanyInterestGeneration = async (
  supabase: SupabaseClient,
  input: RunCompanyInterestGenerationInput,
): Promise<RunCompanyInterestGenerationResult> => {
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
      CRM_AI_FLOW_PROMPT_FLOWS.COMPANY_INTEREST_GENERATION,
    );
    const prompt = buildCompanyInterestPromptFromTemplate(template, {
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

    await insertCompanyInterestRequest(supabase, {
      id: requestId,
      jobId,
      skills,
      canvasWidthPx,
      canvasHeightPx,
      promptText: prompt,
    });

    console.log(`🚀 Launching Cursor agent for company interest — job: ${jobTitle} (${jobId})`);

    const agent = await cursorClient.launchAgent({
      prompt: { text: prompt },
      source: { repository: targetRepo, ref: 'main' },
      target: { autoCreatePr: false },
    });

    exchangeId = randomUUID();
    const exchangeStartTime = Date.now();

    await insertCompanyInterestExchange(supabase, {
      id: exchangeId,
      jobId,
      requestId,
      agentId: agent.id,
    });

    const finalRun = await pollAgentStatus(cursorClient, agent.id, agent.runId);

    const tsx = await extractTsxFromConversation(cursorClient, agent.id, agent.runId, {
      expectedComponentName: COMPANY_INTEREST_COMPONENT_NAME,
    });

    const responseId = randomUUID();
    await insertCompanyInterestResponse(supabase, {
      id: responseId,
      tsxCode: tsx,
      agentSummary: finalRun.result ?? null,
    });

    const durationSeconds = Math.round((Date.now() - exchangeStartTime) / 1000);

    await updateCompanyInterestExchangeCompleted(supabase, {
      id: exchangeId,
      responseId,
      inputTokens: 0,
      outputTokens: 0,
      modelUsed: process.env.CURSOR_AGENT_MODEL?.trim() || 'cursor-agent',
    });

    await updateCompanyInterestRequestCompleted(supabase, requestId);

    console.log(`✅ Company interest generation complete (${durationSeconds}s)`);

    return { tsx, agentId: agent.id, requestId, exchangeId };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    try {
      if (exchangeId) {
        await updateCompanyInterestExchangeFailed(supabase, exchangeId, err.message);
      }
      await updateCompanyInterestRequestFailed(supabase, requestId);
    } catch (updateError) {
      console.error('❌ Failed to update ledger on error:', updateError);
    }

    throw err;
  }
};
