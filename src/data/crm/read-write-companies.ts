import { randomUUID } from "node:crypto";
import type { Company } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getCompanyFromSupabase } from "./supabase/get-company-from-supabase";
import { listCompaniesFromSupabase } from "./supabase/list-companies-from-supabase";

export const listCompaniesFromStore = async (): Promise<Company[]> => {
  return listCompaniesFromSupabase(requireCrmSupabaseClient());
};

export const createCompanyInStore = async (input: {
  name: string;
  website: string;
  notes: string;
}): Promise<Company> => {
  const supabase = requireCrmSupabaseClient();
  const id = randomUUID();
  const now = new Date().toISOString();
  const { error } = await supabase.from("companies").insert({
    id,
    name: input.name.trim(),
    website: input.website.trim(),
    notes: input.notes.trim(),
    website_urls: [],
    playwright_website_url_discovery_attempted: false,
    website_research_summary: "",
    website_research_completed_at: null,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ createCompanyInStore:", error.message);
    throw new Error(error.message);
  }

  const row = await getCompanyFromSupabase(supabase, id);
  if (!row) {
    throw new Error("Failed to load company after insert");
  }
  return row;
};

export const getCompanyFromStore = async (id: string): Promise<Company | null> => {
  return getCompanyFromSupabase(requireCrmSupabaseClient(), id);
};

export const updateCompanyInStore = async (
  id: string,
  patch: Partial<
    Pick<
      Company,
      | "name"
      | "website"
      | "notes"
      | "websiteUrls"
      | "playwrightWebsiteUrlDiscoveryAttempted"
      | "websiteResearchSummary"
      | "websiteResearchCompletedAt"
    >
  >,
): Promise<Company | null> => {
  const supabase = requireCrmSupabaseClient();
  const prev = await getCompanyFromSupabase(supabase, id);
  if (!prev) {
    return null;
  }

  const next: Company = {
    ...prev,
    name: patch.name !== undefined ? patch.name.trim() : prev.name,
    website: patch.website !== undefined ? patch.website.trim() : prev.website,
    notes: patch.notes !== undefined ? patch.notes.trim() : prev.notes,
    websiteUrls: patch.websiteUrls !== undefined ? patch.websiteUrls : prev.websiteUrls,
    playwrightWebsiteUrlDiscoveryAttempted:
      patch.playwrightWebsiteUrlDiscoveryAttempted !== undefined
        ? patch.playwrightWebsiteUrlDiscoveryAttempted
        : prev.playwrightWebsiteUrlDiscoveryAttempted,
    websiteResearchSummary:
      patch.websiteResearchSummary !== undefined
        ? patch.websiteResearchSummary
        : prev.websiteResearchSummary,
    websiteResearchCompletedAt:
      patch.websiteResearchCompletedAt !== undefined
        ? patch.websiteResearchCompletedAt
        : prev.websiteResearchCompletedAt,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("companies")
    .update({
      name: next.name,
      website: next.website,
      notes: next.notes,
      website_urls: next.websiteUrls,
      playwright_website_url_discovery_attempted: next.playwrightWebsiteUrlDiscoveryAttempted,
      website_research_summary: next.websiteResearchSummary,
      website_research_completed_at: next.websiteResearchCompletedAt.trim()
        ? next.websiteResearchCompletedAt
        : null,
      updated_at: next.updatedAt,
    })
    .eq("id", id);

  if (error) {
    console.error("❌ updateCompanyInStore:", error.message);
    throw new Error(error.message);
  }

  return next;
};

export const deleteCompanyFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("companies").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteCompanyFromStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
