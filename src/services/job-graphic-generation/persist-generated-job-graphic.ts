import type { SupabaseClient } from '@supabase/supabase-js';
import {
  insertImageGraphic,
  patchImageGraphicStudioDraft,
} from '../../data/image-graphics';
import type { ImageGraphic } from '../../data/image-graphics/types';

export type JobGraphicGenerationKind =
  | 'resume'
  | 'coverLetter'
  | 'companyInterest'
  | 'teamConversation';

type KindConfig = {
  titlePrefix: string;
  metadataSourceKey: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
};

const KIND_CONFIG: Record<JobGraphicGenerationKind, KindConfig> = {
  resume: {
    titlePrefix: 'Skills —',
    metadataSourceKey: 'skillsComponentSource',
    canvasWidthPx: 816,
    canvasHeightPx: 1150,
  },
  coverLetter: {
    titlePrefix: 'Cover letter —',
    metadataSourceKey: 'coverLetterSource',
    canvasWidthPx: 816,
    canvasHeightPx: 1056,
  },
  companyInterest: {
    titlePrefix: 'Company interest —',
    metadataSourceKey: 'companyInterestSource',
    canvasWidthPx: 816,
    canvasHeightPx: 480,
  },
  teamConversation: {
    titlePrefix: 'Team conversation —',
    metadataSourceKey: 'teamConversationSource',
    canvasWidthPx: 816,
    canvasHeightPx: 480,
  },
};

export type PersistGeneratedJobGraphicInput = {
  kind: JobGraphicGenerationKind;
  jobId: string;
  jobTitle: string;
  tsx: string;
  requestId?: string;
  exchangeId?: string;
};

/**
 * Creates a job-tagged image graphic and saves generated TSX into `metadata.studioDraft`.
 *
 * @param supabase - Supabase service-role client
 * @param input - Graphic kind, job context, and generated TSX
 * @returns Persisted graphic row
 */
export const persistGeneratedJobGraphic = async (
  supabase: SupabaseClient,
  input: PersistGeneratedJobGraphicInput,
): Promise<ImageGraphic> => {
  const config = KIND_CONFIG[input.kind];
  const trimmedJobId = input.jobId.trim();
  const titleBase = input.jobTitle.trim() || `Job ${trimmedJobId.slice(0, 8)}`;

  const metadata: Record<string, unknown> = {
    [config.metadataSourceKey]: 'cursor',
  };
  if (input.requestId?.trim()) {
    metadata.resumeTsxRequestId = input.requestId.trim();
  }
  if (input.exchangeId?.trim()) {
    metadata.resumeTsxExchangeId = input.exchangeId.trim();
  }

  const graphic = await insertImageGraphic(supabase, {
    title: `${config.titlePrefix} ${titleBase}`,
    canvasWidthPx: config.canvasWidthPx,
    canvasHeightPx: config.canvasHeightPx,
    jobId: trimmedJobId,
    metadata,
  });

  const patched = await patchImageGraphicStudioDraft(supabase, graphic.id, input.tsx);
  if (!patched) {
    throw new Error(`Failed to patch studio draft for graphic ${graphic.id}`);
  }

  return patched;
};
