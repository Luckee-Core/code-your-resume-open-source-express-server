import { SupabaseClient } from "@supabase/supabase-js";
import {
  listJobStudioExchangesByJobId,
  listJobStudioRequestsByIds,
  listJobStudioResponsesByIds,
} from "../../data/job-studio";

const formatMessageClock = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

type StructuredCoach = {
  content?: unknown;
  coachSections?: unknown;
};

const isCoachSectionBlock = (x: unknown): x is { heading: string; bullets: string[] } => {
  if (!x || typeof x !== "object") return false;
  const o = x as { heading?: unknown; bullets?: unknown };
  return typeof o.heading === "string" && Array.isArray(o.bullets) && o.bullets.every((b) => typeof b === "string");
};

const normalizeCoachSections = (raw: unknown): { heading: string; bullets: string[] }[] | undefined => {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const blocks = raw.filter(isCoachSectionBlock);
  return blocks.length ? blocks : undefined;
};

export type JobStudioChatMessagePayload = {
  id: string;
  role: "user" | "coach";
  content: string;
  sections?: { heading: string; bullets: string[] }[];
  timestamp: string;
  rawTime: string;
};

export type JobStudioPayload = {
  messages: JobStudioChatMessagePayload[];
};

/**
 * Build Job Studio chat transcript for one job from Supabase ledger rows.
 */
export const loadJobStudioPayload = async (
  supabase: SupabaseClient,
  jobId: string,
): Promise<JobStudioPayload> => {
  const exchangeRows = await listJobStudioExchangesByJobId(supabase, jobId);
  const withResponse = exchangeRows.filter((ex) => ex.response_id);
  const requestIds = [...new Set(withResponse.map((ex) => ex.request_id))];
  const responseIds = withResponse.map((ex) => ex.response_id as string);

  const [reqRows, resRows] = await Promise.all([
    listJobStudioRequestsByIds(supabase, requestIds),
    listJobStudioResponsesByIds(supabase, responseIds),
  ]);
  const reqById = new Map(reqRows.map((r) => [r.id, r]));
  const resById = new Map(resRows.map((r) => [r.id, r]));

  const messages: JobStudioChatMessagePayload[] = [];

  for (const ex of withResponse) {
    const req = reqById.get(ex.request_id);
    if (req) {
      messages.push({
        id: req.id,
        role: "user",
        content: req.content,
        timestamp: formatMessageClock(req.created_at),
        rawTime: req.created_at,
      });
    }
    const rid = ex.response_id as string;
    const resp = resById.get(rid);
    const structured = (resp?.structured ?? {}) as StructuredCoach;
    const content =
      typeof structured.content === "string" ? structured.content : "No response content.";
    const coachBlocks = normalizeCoachSections(structured.coachSections);
    messages.push({
      id: rid,
      role: "coach",
      content,
      ...(coachBlocks ? { sections: coachBlocks } : {}),
      timestamp: formatMessageClock(ex.created_at),
      rawTime: ex.created_at,
    });
  }

  return { messages };
};
