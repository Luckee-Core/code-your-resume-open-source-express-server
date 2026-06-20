/** `crm_ai_flow_prompt.flow` values for studio and generation templates. */
export const CRM_AI_FLOW_PROMPT_FLOWS = {
  JOB_STUDIO: 'job_studio',
  TECHNICAL_SKILLS: 'technical_skills',
  USER_BACKGROUND_STUDIO: 'user_background_studio',
  COVER_LETTER_GENERATION: 'cover_letter_generation',
  COMPANY_INTEREST_GENERATION: 'company_interest_generation',
  TEAM_CONVERSATION_GENERATION: 'team_conversation_generation',
  IDEAL_CANDIDATE_GENERATION: 'ideal_candidate_generation',
  SKILLS_COMPONENT_GENERATION: 'skills_component_generation',
  PROJECT_NOTES_SYNTHESIS: 'project_notes_synthesis',
} as const;

export type CrmAiFlowPromptFlow =
  (typeof CRM_AI_FLOW_PROMPT_FLOWS)[keyof typeof CRM_AI_FLOW_PROMPT_FLOWS];

export const CRM_AI_FLOW_PROMPT_FLOW_LABELS: Record<string, string> = {
  job_studio: 'Job Studio coach',
  technical_skills: 'Technical skills coach',
  user_background_studio: 'User background studio',
  cover_letter_generation: 'Cover letter generation',
  company_interest_generation: 'Company interest generation',
  team_conversation_generation: 'Team conversation generation',
  ideal_candidate_generation: 'Ideal candidate generation',
  skills_component_generation: 'Skills component generation',
  project_notes_synthesis: 'Project notes synthesis',
};
