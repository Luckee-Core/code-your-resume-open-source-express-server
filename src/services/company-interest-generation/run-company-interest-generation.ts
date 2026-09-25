import { randomUUID } from 'crypto';
import type { Pool } from 'pg';
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
  voiceStyle: string;
  projectsBlock: string;
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
 * @param pool - Supabase service-role client for ledger writes
 * @param input - Job context, background segments, optional skills
 * @returns Generated TSX string and ledger IDs
 */
export const runCompanyInterestGeneration = async (
  pool: Pool,
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
    voiceStyle,
    projectsBlock,
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
      pool,
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
      voiceStyle,
      projectsBlock,
      skills,
    });

    await insertCompanyInterestRequest(pool, {
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

    await insertCompanyInterestExchange(pool, {
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
    await insertCompanyInterestResponse(pool, {
      id: responseId,
      tsxCode: tsx,
      agentSummary: finalRun.result ?? null,
    });

    const durationSeconds = Math.round((Date.now() - exchangeStartTime) / 1000);

    await updateCompanyInterestExchangeCompleted(pool, {
      id: exchangeId,
      responseId,
      inputTokens: 0,
      outputTokens: 0,
      modelUsed: agent.modelId,
    });

    await updateCompanyInterestRequestCompleted(pool, requestId);

    console.log(`✅ Company interest generation complete (${durationSeconds}s)`);

    return { tsx, agentId: agent.id, requestId, exchangeId };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    try {
      if (exchangeId) {
        await updateCompanyInterestExchangeFailed(pool, exchangeId, err.message);
      }
      await updateCompanyInterestRequestFailed(pool, requestId);
    } catch (updateError) {
      console.error('❌ Failed to update ledger on error:', updateError);
    }

    throw err;
  }
};
