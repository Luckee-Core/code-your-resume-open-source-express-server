/**
 * Builds the user turn payload sent to the AI.
 * Only passes technical_skills segment items to minimise context tokens.
 */
export const buildUserBackgroundCoachUserPayload = (params: {
  currentSegmentItems: unknown;
  recentChat: { role: string; content: string }[];
  userMessage: string;
}): string => {
  return `Current technical skills (use ids for updates):\n${JSON.stringify(
    params.currentSegmentItems,
    null,
    2,
  )}\n\nRecent chat (oldest first):\n${JSON.stringify(params.recentChat, null, 2)}\n\nUser message:\n${params.userMessage}`;
};
