export type ProjectRow = {
  id: string;
  business_name: string;
  description: string;
  url: string;
  duration: string;
  technologies: unknown;
  website_research_summary: string;
  website_research_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  businessName: string;
  description: string;
  url: string;
  duration: string;
  technologies: string[];
  websiteResearchSummary: string;
  websiteResearchCompletedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectInput = {
  businessName: string;
  description?: string;
  url?: string;
  duration?: string;
  technologies?: string[];
};

export type UpdateProjectInput = {
  businessName?: string;
  description?: string;
  url?: string;
  duration?: string;
  technologies?: string[];
  websiteResearchSummary?: string;
  websiteResearchCompletedAt?: string;
};
