import type { JobStudioCoachContext } from "./loadJobStudioCoachContext";

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
    recentChat,
    userMessage,
  };

  return JSON.stringify(blocks, null, 2);
};
