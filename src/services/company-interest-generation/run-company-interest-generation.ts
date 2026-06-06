import { randomUUID } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getCursorClient } from '../cursor';
import { pollAgentStatus } from '../cursor/poll-agent-status';
import { extractTsxFromConversation } from '../cursor/extract-tsx-from-conversation';
import { buildCompanyInterestPrompt } from './build-company-interest-prompt';
import {
  insertResumeTsxRequest,
  insertResumeTsxExchange,
  insertResumeTsxResponse,
  updateResumeTsxExchangeCompleted,
  updateResumeTsxExchangeFailed,
  updateResumeTsxRequestCompleted,
  updateResumeTsxRequestFailed,
} from '../../data/resume-tsx-code-generation';

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
    const prompt = buildCompanyInterestPrompt({
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

    await insertResumeTsxRequest(supabase, {
      id: requestId,
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

    await insertResumeTsxExchange(supabase, {
      id: exchangeId,
      requestId,
      agentId: agent.id,
    });

    const finalRun = await pollAgentStatus(cursorClient, agent.id, agent.runId);

    const tsx = await extractTsxFromConversation(cursorClient, agent.id, agent.runId, {
      expectedComponentName: COMPANY_INTEREST_COMPONENT_NAME,
    });

    const responseId = randomUUID();
    await insertResumeTsxResponse(supabase, {
      id: responseId,
      tsxCode: tsx,
      agentSummary: finalRun.result ?? null,
    });

    const durationSeconds = Math.round((Date.now() - exchangeStartTime) / 1000);
    const apiCallsCount = 1 + Math.max(1, Math.ceil(durationSeconds / 30));
    const costEstimate = apiCallsCount * 0.01;

    await updateResumeTsxExchangeCompleted(supabase, {
      id: exchangeId,
      responseId,
      durationSeconds,
      apiCallsCount,
      costEstimate,
    });

    await updateResumeTsxRequestCompleted(supabase, requestId);

    console.log(`✅ Company interest generation complete (${durationSeconds}s)`);

    return { tsx, agentId: agent.id, requestId, exchangeId };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    try {
      if (exchangeId) {
        await updateResumeTsxExchangeFailed(supabase, exchangeId, err.message);
      }
      await updateResumeTsxRequestFailed(supabase, requestId);
    } catch (updateError) {
      console.error('❌ Failed to update ledger on error:', updateError);
    }

    throw err;
  }
};
