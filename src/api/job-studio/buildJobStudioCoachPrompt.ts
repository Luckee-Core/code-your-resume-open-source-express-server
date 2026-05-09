import type { JobStudioCoachContext } from "./loadJobStudioCoachContext";

/**
 * System prompt: Job Studio coach (chat-only; no structured edits to CRM).
 */
export const buildJobStudioCoachSystemPrompt = (): string => {
  return [
    "You are an experienced career coach helping the user think through ONE job opportunity.",
    "You receive job metadata, bullet lists (responsibilities, requirements, nice-to-haves), and logged applications.",
    "Give practical, honest guidance: fit, gaps, how to prepare, questions to ask, and application strategy.",
    "Do not invent employer-specific facts not present in the context. If something is unknown, say so.",
    "Do not output machine-readable patches or JSON edits to the bullet lists—the user edits those manually.",
    "Reply ONLY with valid JSON matching this shape:",
    '{"content":"string (plain narrative; may use short paragraphs)","coachSections":[{"heading":"string","bullets":["string"]}]}',
    "Use coachSections when lists improve readability; omit coachSections if a single narrative content is enough.",
    "Keep content concise but useful.",
  ].join("\n");
};

/**
 * Build user payload string sent to the model (structured blocks).
 */
export const buildJobStudioCoachUserPayload = (params: {
  context: JobStudioCoachContext;
  recentChat: { role: string; content: string }[];
  userMessage: string;
}): string => {
  const { context, recentChat, userMessage } = params;

  const blocks: Record<string, unknown> = {
    job: {
      title: context.jobTitle,
      company: context.companyName,
      postingUrl: context.postingUrl || null,
      description: context.description || null,
    },
    bullets: {
      responsibilities: context.responsibilities,
      requirements: context.requirements,
      niceToHaves: context.niceToHaves,
    },
    applications: context.applicationsSummary,
    recentChat,
    userMessage,
  };

  return JSON.stringify(blocks, null, 2);
};
