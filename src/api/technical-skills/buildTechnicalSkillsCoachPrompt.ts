/**
 * Builds the user turn payload sent to the AI.
 */
export const buildTechnicalSkillsCoachUserPayload = (params: {
  currentSkills: unknown;
  recentChat: { role: string; content: string }[];
  userMessage: string;
}): string => {
  return `Current technical skills (use ids for updates):\n${JSON.stringify(
    params.currentSkills,
    null,
    2,
  )}\n\nRecent chat (oldest first):\n${JSON.stringify(params.recentChat, null, 2)}\n\nUser message:\n${params.userMessage}`;
};
