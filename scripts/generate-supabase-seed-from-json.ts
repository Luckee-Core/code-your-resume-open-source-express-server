/**
 * Reads CRM + job-listing JSON vault files and writes Supabase seed SQL.
 *
 * Defaults (Express server cwd):
 *   .data/crm/{companies,employees,jobs,job-applications}.json
 *   .data/job-listing/job-listing-scrape-runs.json
 *
 * Override with CRM_DATA_DIR / JOB_LISTING_DATA_DIR (same as runtime Express).
 *
 * Usage:
 *   npx ts-node scripts/generate-supabase-seed-from-json.ts
 *   npx ts-node scripts/generate-supabase-seed-from-json.ts --out docs/supabase-seed-from-local-json.sql
 */
import fs from "node:fs";
import path from "node:path";
import type { Company, Employee, Job, JobApplication } from "../src/data/crm/types";
import type { JobListingScrapeRun } from "../src/data/job-listing/types";

type SeedPaths = {
  crmDir: string;
  jobListingDir: string;
  outFile: string;
};

const readJsonArray = <T>(filePath: string): T[] => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array in ${filePath}`);
  }
  return parsed as T[];
};

/** Dollar-quote a string for safe SQL literal insertion. */
const dollarQuote = (value: string): string => {
  let tag = "seed";
  while (value.includes(`$${tag}$`)) {
    tag += "_";
  }
  return `$${tag}$${value}$${tag}$`;
};

const sqlText = (value: string): string => dollarQuote(value ?? "");

const sqlTimestamptz = (value: string | null | undefined): string => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "NULL";
  }
  return `${dollarQuote(trimmed)}::timestamptz`;
};

const sqlUuid = (value: string | null | undefined): string => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "NULL";
  }
  return `${dollarQuote(trimmed)}::uuid`;
};

const sqlJsonb = (value: unknown): string => {
  return `${dollarQuote(JSON.stringify(value ?? []))}::jsonb`;
};

const parseArgs = (): SeedPaths => {
  const cwd = process.cwd();
  const crmDir = process.env.CRM_DATA_DIR?.trim()
    ? path.resolve(process.env.CRM_DATA_DIR.trim())
    : path.join(cwd, ".data", "crm");
  const jobListingDir = process.env.JOB_LISTING_DATA_DIR?.trim()
    ? path.resolve(process.env.JOB_LISTING_DATA_DIR.trim())
    : path.join(crmDir, "..", "job-listing");

  const outIdx = process.argv.indexOf("--out");
  const outFile =
    outIdx >= 0 && process.argv[outIdx + 1]
      ? path.resolve(process.argv[outIdx + 1]!)
      : path.join(cwd, "docs", "supabase-seed-from-local-json.sql");

  return { crmDir, jobListingDir, outFile };
};

const buildCompanyInsert = (rows: Company[]): string => {
  if (rows.length === 0) {
    return "-- companies: (no rows in JSON)\n";
  }

  const values = rows
    .map((row) => {
      return `  (
    ${sqlUuid(row.id)},
    ${sqlText(row.name)},
    ${sqlText(row.website ?? "")},
    ${sqlText(row.notes ?? "")},
    ${sqlJsonb(row.websiteUrls ?? [])},
    ${row.playwrightWebsiteUrlDiscoveryAttempted ? "true" : "false"},
    ${sqlText(row.websiteResearchSummary ?? "")},
    ${sqlTimestamptz(row.websiteResearchCompletedAt)},
    ${sqlTimestamptz(row.createdAt)},
    ${sqlTimestamptz(row.updatedAt)}
  )`;
    })
    .join(",\n");

  return `-- companies (${rows.length} rows)
INSERT INTO companies (
  id, name, website, notes, website_urls,
  playwright_website_url_discovery_attempted, website_research_summary,
  website_research_completed_at, created_at, updated_at
)
VALUES
${values}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  notes = EXCLUDED.notes,
  website_urls = EXCLUDED.website_urls,
  playwright_website_url_discovery_attempted = EXCLUDED.playwright_website_url_discovery_attempted,
  website_research_summary = EXCLUDED.website_research_summary,
  website_research_completed_at = EXCLUDED.website_research_completed_at,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;
`;
};

const buildEmployeeInsert = (rows: Employee[]): string => {
  if (rows.length === 0) {
    return "-- employees: (no rows in JSON)\n";
  }

  const values = rows
    .map((row) => {
      return `  (
    ${sqlUuid(row.id)},
    ${sqlUuid(row.companyId)},
    ${sqlText(row.name)},
    ${sqlText(row.role ?? "")},
    ${sqlText(row.email ?? "")},
    ${sqlText(row.linkedinUrl ?? "")},
    ${sqlTimestamptz(row.createdAt)},
    ${sqlTimestamptz(row.updatedAt)}
  )`;
    })
    .join(",\n");

  return `-- employees (${rows.length} rows)
INSERT INTO employees (
  id, company_id, name, role, email, linkedin_url, created_at, updated_at
)
VALUES
${values}
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  linkedin_url = EXCLUDED.linkedin_url,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;
`;
};

const buildJobInsert = (rows: Job[]): string => {
  if (rows.length === 0) {
    return "-- jobs: (no rows in JSON)\n";
  }

  const values = rows
    .map((row) => {
      return `  (
    ${sqlUuid(row.id)},
    ${sqlUuid(row.companyId)},
    ${sqlText(row.title)},
    ${sqlText(row.url ?? "")},
    ${sqlText(row.status ?? "draft")},
    ${sqlText(row.description ?? "")},
    ${sqlTimestamptz(row.listingImportedAt)},
    ${sqlUuid(row.latestScrapeRunId)},
    ${sqlUuid(row.latestAiExchangeId)},
    ${sqlTimestamptz(row.createdAt)},
    ${sqlTimestamptz(row.updatedAt)}
  )`;
    })
    .join(",\n");

  return `-- jobs (${rows.length} rows)
INSERT INTO jobs (
  id, company_id, title, url, status, description,
  listing_imported_at, latest_scrape_run_id, latest_ai_exchange_id,
  created_at, updated_at
)
VALUES
${values}
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  title = EXCLUDED.title,
  url = EXCLUDED.url,
  status = EXCLUDED.status,
  description = EXCLUDED.description,
  listing_imported_at = EXCLUDED.listing_imported_at,
  latest_scrape_run_id = EXCLUDED.latest_scrape_run_id,
  latest_ai_exchange_id = EXCLUDED.latest_ai_exchange_id,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;
`;
};

const buildImageGraphicStubs = (applications: JobApplication[]): string => {
  const ids = [...new Set(applications.map((row) => row.imageGraphicId).filter(Boolean))];
  if (ids.length === 0) {
    return "-- image_graphics: (no job applications referencing graphics)\n";
  }

  const values = ids
    .map((id) => {
      return `  (
    ${sqlUuid(id)},
    ${sqlText("Seeded graphic stub")},
    960,
    540,
    '{}'::jsonb,
    NOW(),
    NOW()
  )`;
    })
    .join(",\n");

  return `-- image_graphics stubs for job_applications FK (${ids.length} rows)
INSERT INTO image_graphics (
  id, title, canvas_width_px, canvas_height_px, metadata, created_at, updated_at
)
VALUES
${values}
ON CONFLICT (id) DO NOTHING;
`;
};

const buildJobApplicationInsert = (rows: JobApplication[]): string => {
  if (rows.length === 0) {
    return "-- job_applications: (no rows in JSON)\n";
  }

  const values = rows
    .map((row) => {
      return `  (
    ${sqlUuid(row.id)},
    ${sqlUuid(row.jobId)},
    ${sqlTimestamptz(row.submittedAt)},
    ${sqlUuid(row.imageGraphicId)},
    ${sqlText(row.notes ?? "")},
    ${sqlTimestamptz(row.createdAt)},
    ${sqlTimestamptz(row.updatedAt)}
  )`;
    })
    .join(",\n");

  return `-- job_applications (${rows.length} rows)
INSERT INTO job_applications (
  id, job_id, submitted_at, image_graphic_id, notes, created_at, updated_at
)
VALUES
${values}
ON CONFLICT (id) DO UPDATE SET
  job_id = EXCLUDED.job_id,
  submitted_at = EXCLUDED.submitted_at,
  image_graphic_id = EXCLUDED.image_graphic_id,
  notes = EXCLUDED.notes,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;
`;
};

const buildScrapeRunInsert = (rows: JobListingScrapeRun[]): string => {
  if (rows.length === 0) {
    return "-- job_listing_scrape_runs: (no rows in JSON)\n";
  }

  const values = rows
    .map((row) => {
      const httpStatus =
        row.httpStatus === null || row.httpStatus === undefined
          ? "NULL"
          : String(row.httpStatus);
      return `  (
    ${sqlUuid(row.id)},
    ${sqlUuid(row.jobId)},
    ${sqlText(row.sourceUrl)},
    ${sqlText(row.status)},
    ${httpStatus},
    ${sqlText(row.plainText ?? "")},
    ${sqlText(row.error ?? "")},
    ${sqlTimestamptz(row.startedAt)},
    ${sqlTimestamptz(row.completedAt)}
  )`;
    })
    .join(",\n");

  return `-- job_listing_scrape_runs (${rows.length} rows)
INSERT INTO job_listing_scrape_runs (
  id, job_id, source_url, status, http_status, plain_text, error,
  started_at, completed_at
)
VALUES
${values}
ON CONFLICT (id) DO UPDATE SET
  job_id = EXCLUDED.job_id,
  source_url = EXCLUDED.source_url,
  status = EXCLUDED.status,
  http_status = EXCLUDED.http_status,
  plain_text = EXCLUDED.plain_text,
  error = EXCLUDED.error,
  started_at = EXCLUDED.started_at,
  completed_at = EXCLUDED.completed_at;
`;
};

const main = (): void => {
  const paths = parseArgs();

  const companies = readJsonArray<Company>(path.join(paths.crmDir, "companies.json"));
  const employees = readJsonArray<Employee>(path.join(paths.crmDir, "employees.json"));
  const jobs = readJsonArray<Job>(path.join(paths.crmDir, "jobs.json"));
  const applications = readJsonArray<JobApplication>(
    path.join(paths.crmDir, "job-applications.json")
  );
  const scrapeRuns = readJsonArray<JobListingScrapeRun>(
    path.join(paths.jobListingDir, "job-listing-scrape-runs.json")
  );

  const header = `-- Supabase CRM seed — paste into SQL Editor and Run
-- Generated: ${new Date().toISOString()}

BEGIN;

-- Older Supabase projects may have companies/jobs without newer columns.
-- CREATE TABLE IF NOT EXISTS does not add columns to existing tables.
ALTER TABLE companies ADD COLUMN IF NOT EXISTS website_urls JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS playwright_website_url_discovery_attempted BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS website_research_summary TEXT NOT NULL DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS website_research_completed_at TIMESTAMPTZ;

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS listing_imported_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS latest_scrape_run_id UUID;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS latest_ai_exchange_id UUID;

CREATE TABLE IF NOT EXISTS job_listing_scrape_runs (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  http_status INTEGER,
  plain_text TEXT NOT NULL DEFAULT '',
  error TEXT NOT NULL DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ
);

`;

  const body = [
    buildCompanyInsert(companies),
    buildEmployeeInsert(employees),
    buildImageGraphicStubs(applications),
    buildJobInsert(jobs),
    buildScrapeRunInsert(scrapeRuns),
    buildJobApplicationInsert(applications),
  ].join("\n");

  const footer = `
COMMIT;
`;

  fs.mkdirSync(path.dirname(paths.outFile), { recursive: true });
  fs.writeFileSync(paths.outFile, header + body + footer, "utf8");

  console.log(`✅ Wrote ${paths.outFile}`);
  console.log(
    `   companies=${companies.length} employees=${employees.length} jobs=${jobs.length} applications=${applications.length} scrape_runs=${scrapeRuns.length}`
  );
};

main();
