import { buildActionEntityDocs } from "../../utils/api-docs";
import type { ApiDocsCatalog, ApiDocsGroup } from "./types";

const DEFAULT_PORT = 3053;

const successEnvelope = <T>(data: T) => ({ success: true, data });
const errorEnvelope = (error: string) => ({ success: false, error });

const ts = "2026-01-15T12:00:00.000Z";

const companyExample = {
  id: "uuid",
  name: "Acme Corp",
  website: "https://acme.example",
  notes: "",
  websiteUrls: ["https://acme.example/about"],
  playwrightWebsiteUrlDiscoveryAttempted: false,
  websiteResearchSummary: "",
  websiteResearchCompletedAt: "",
  createdAt: ts,
  updatedAt: ts,
};

const jobExample = {
  id: "uuid",
  companyId: "uuid",
  type: "job",
  title: "Senior Software Engineer",
  url: "https://jobs.example/posting",
  status: "draft",
  description: "Plain-text listing body…",
  listingImportedAt: ts,
  latestScrapeRunId: "uuid",
  latestAiExchangeId: "uuid",
  responsibilities: ["Build features"],
  requirements: ["5+ years experience"],
  niceToHaves: ["TypeScript"],
  createdAt: ts,
  updatedAt: ts,
};

const jobQuestionExample = {
  id: "uuid",
  prompt: "Describe a challenging project you led.",
  createdAt: ts,
  updatedAt: ts,
};

const jobQuestionAnswerExample = {
  id: "uuid",
  jobId: "uuid",
  jobQuestionId: "uuid",
  answer: "Led migration to TypeScript…",
  createdAt: ts,
  updatedAt: ts,
};

const imageGraphicExample = {
  id: "uuid",
  title: "Resume skills block",
  jobId: "uuid",
  canvasWidthPx: 800,
  canvasHeightPx: 600,
  metadata: {},
  createdAt: ts,
  updatedAt: ts,
};

const jobListingSectionExample = {
  id: "uuid",
  jobId: "uuid",
  body: "Own end-to-end delivery of features",
  sortOrder: 0,
  createdAt: ts,
};

const buildOverviewGroup = (): ApiDocsGroup => ({
  name: "Overview",
  description: [
    "REST API for the open-source Code Your Resume app. Supabase stores CRM entities (companies, jobs), graphics, studio state, and error logs; this Express server exposes action routes over HTTP for the Next.js dashboard or any client.",
    "Route layout: `/api/data/*` — CRM entity actions (`/list`, `/create`, `/update`, …); `/api/technical-skills/*`, `/api/professional-background/*`, `/api/job-studio/*`, `/api/user-background-studio/*` — studio coaches; `GET /api-docs.json` — this catalog. Standard CRM entities use GET list/get, POST create, PATCH update, DELETE delete. Exceptions (AI generation, job import, website research) are documented on their group.",
    "Typical flow: create companies → add jobs (optionally import listing URL) → use Technical Skills / Professional Background / Job Studio coaches → generate TSX skills components and cover letters per role.",
    "Success JSON: `{ success: true, data?, count?, message? }`. Error JSON: `{ success: false, error: string }`. OSS default has no auth — bind to localhost or set optional `CRM_API_SECRET` shared with the Next.js BFF. Core CRM requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. AI features need `ANTHROPIC_API_KEY`; skills component generation may use `CURSOR_API_KEY`.",
  ].join("\n\n"),
  endpoints: [],
});

const buildHealthGroup = (): ApiDocsGroup => ({
  name: "Health",
  description:
    "Liveness probe for load balancers and local dev. Returns plain JSON without the `{ success, data }` envelope.",
  endpoints: [
    {
      method: "GET",
      path: "/api/health",
      summary: "Health check",
      responses: [
        {
          status: 200,
          description: "Server is running (no success wrapper)",
          example: {
            status: "ok",
            message: "Code Your Resume Express API is running",
            timestamp: ts,
            environment: "development",
          },
        },
      ],
    },
  ],
});

const buildCompaniesGroup = (): ApiDocsGroup => ({
  name: "Companies",
  description:
    "Job-search CRM companies. Create companies before jobs. Supports one-shot website URL discovery and AI website research summaries.",
  endpoints: [
    ...buildActionEntityDocs({
      entityName: "company",
      basePath: "/api/data/company",
      entityExample: companyExample,
      createBodyExample: { name: "Acme Corp", website: "https://acme.example" },
      patchBodyExample: { id: "uuid", name: "Acme Corporation", notes: "Target employer" },
    }),
    {
      method: "POST",
      path: "/api/data/company/discover-site-page-urls",
      summary: "Discover same-domain URLs from company homepage",
      requestBody: {
        contentType: "application/json",
        example: { id: "uuid" },
      },
      responses: [
        {
          status: 200,
          description: "Updated company with harvested URLs",
          example: successEnvelope(companyExample),
        },
        {
          status: 400,
          description: "Invalid id or discovery already attempted",
          example: errorEnvelope("id is required"),
        },
        { status: 500, description: "Server error", example: errorEnvelope("Discovery failed") },
      ],
    },
    {
      method: "POST",
      path: "/api/data/company/website-research",
      summary: "Crawl company site and store AI research summary",
      requestBody: {
        contentType: "application/json",
        example: { id: "uuid" },
      },
      responses: [
        {
          status: 200,
          description: "Company with research summary",
          example: successEnvelope({ ...companyExample, websiteResearchSummary: "Acme builds…" }),
        },
        { status: 400, description: "Validation error", example: errorEnvelope("id is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Research failed") },
      ],
    },
  ],
});

const buildJobsGroup = (): ApiDocsGroup => ({
  name: "Jobs",
  description:
    "Job postings and contract engagements tied to a company. Import listing text from a URL, extract responsibilities/requirements with AI, and track application status through the pipeline.",
  endpoints: [
    ...buildActionEntityDocs({
      entityName: "job",
      basePath: "/api/data/job",
      entityExample: jobExample,
      createBodyExample: {
        companyId: "uuid",
        title: "Senior Software Engineer",
        url: "https://jobs.example/posting",
      },
      patchBodyExample: { id: "uuid", status: "applied", title: "Staff Engineer" },
    }),
    {
      method: "POST",
      path: "/api/data/job/create-from-listing-url",
      summary: "Create job from posting URL and run import pipeline",
      requestBody: {
        contentType: "application/json",
        example: { companyId: "uuid", url: "https://jobs.example/posting" },
      },
      responses: [
        { status: 200, description: "Created and imported job", example: successEnvelope(jobExample) },
        { status: 400, description: "Validation error", example: errorEnvelope("url is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Import failed") },
      ],
    },
    {
      method: "POST",
      path: "/api/data/job/import-listing",
      summary: "Re-import listing for an existing job",
      requestBody: {
        contentType: "application/json",
        example: { id: "uuid" },
      },
      responses: [
        { status: 200, description: "Updated job with fresh listing", example: successEnvelope(jobExample) },
        { status: 400, description: "Missing job id", example: errorEnvelope("id is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Import failed") },
      ],
    },
    {
      method: "POST",
      path: "/api/data/job/import-description",
      summary: "Import job description from pasted text",
      requestBody: {
        contentType: "application/json",
        example: { id: "uuid", description: "Full posting plain text…" },
      },
      responses: [
        { status: 200, description: "Updated job", example: successEnvelope(jobExample) },
        { status: 400, description: "Validation error", example: errorEnvelope("description is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Import failed") },
      ],
    },
  ],
});

const buildJobListingSectionListGroup = (
  name: string,
  basePath: string,
  entityLabel: string,
  description: string,
): ApiDocsGroup => ({
  name,
  description,
  endpoints: [
    {
      method: "GET",
      path: `${basePath}/list`,
      summary: `List ${entityLabel} for a job`,
      queryParams: [{ name: "jobId", description: "Job UUID", required: true }],
      responses: [
        {
          status: 200,
          description: "Array of section rows",
          example: successEnvelope([jobListingSectionExample]),
        },
        {
          status: 400,
          description: "Missing jobId",
          example: errorEnvelope("jobId query param is required"),
        },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to list") },
      ],
    },
  ],
});

const buildJobQuestionsGroup = (): ApiDocsGroup => ({
  name: "Job questions",
  description:
    "Reusable application question prompts (global catalog). Link answers per job via job question answers.",
  endpoints: buildActionEntityDocs({
    entityName: "job question",
    basePath: "/api/data/job-questions",
    entityExample: jobQuestionExample,
    createBodyExample: { prompt: "Why do you want to work here?" },
    patchBodyExample: { id: "uuid", prompt: "Describe your leadership style." },
  }),
});

const buildJobQuestionAnswersGroup = (): ApiDocsGroup => ({
  name: "Job question answers",
  description: "Per-job answers to reusable job questions. Used when preparing application materials.",
  endpoints: buildActionEntityDocs({
    entityName: "job question answer",
    basePath: "/api/data/job-question-answers",
    entityExample: jobQuestionAnswerExample,
    createBodyExample: {
      jobId: "uuid",
      jobQuestionId: "uuid",
      answer: "I am motivated by…",
    },
    patchBodyExample: { id: "uuid", answer: "Updated answer text" },
  }),
});

const buildImageGraphicsGroup = (): ApiDocsGroup => ({
  name: "Image graphics",
  description:
    "Graphics Studio layouts stored in Supabase `image_graphics`. Draft TSX and canvas dimensions; link graphics to jobs for applications.",
  endpoints: [
    ...buildActionEntityDocs({
      entityName: "image graphic",
      basePath: "/api/data/image-graphic",
      entityExample: imageGraphicExample,
      createBodyExample: { title: "Skills block", jobId: "uuid", canvasWidthPx: 800, canvasHeightPx: 600 },
      patchBodyExample: { id: "uuid", title: "Updated title" },
    }),
    {
      method: "PATCH",
      path: "/api/data/image-graphic/patch-studio-draft",
      summary: "Patch studio draft TSX and metadata",
      requestBody: {
        contentType: "application/json",
        example: { id: "uuid", draftTsx: "<section>…</section>", metadata: {} },
      },
      responses: [
        { status: 200, description: "Updated graphic", example: successEnvelope(imageGraphicExample) },
        { status: 400, description: "Validation error", example: errorEnvelope("id is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to patch draft") },
      ],
    },
    {
      method: "PATCH",
      path: "/api/data/image-graphic/update-details",
      summary: "Update graphic title and canvas dimensions",
      requestBody: {
        contentType: "application/json",
        example: { id: "uuid", title: "Cover letter", canvasWidthPx: 816, canvasHeightPx: 1056 },
      },
      responses: [
        { status: 200, description: "Updated graphic", example: successEnvelope(imageGraphicExample) },
        { status: 400, description: "Validation error", example: errorEnvelope("id is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to update") },
      ],
    },
  ],
});

const buildGenerationGroup = (
  name: string,
  path: string,
  summary: string,
  description: string,
): ApiDocsGroup => ({
  name,
  description,
  endpoints: [
    {
      method: "POST",
      path,
      summary,
      requestBody: {
        contentType: "application/json",
        example: { jobId: "uuid" },
      },
      responses: [
        {
          status: 200,
          description: "Generated TSX string",
          example: { success: true, tsx: "<section className=\"…\">…</section>" },
        },
        { status: 400, description: "Validation error", example: errorEnvelope("jobId is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Generation failed") },
      ],
    },
  ],
});

const buildErrorReportingGroup = (): ApiDocsGroup => ({
  name: "Error reporting",
  description:
    "Client error persistence for production debugging. Next.js thunks report unexpected failures; UI and API layers may report structured errors to Supabase audit tables.",
  endpoints: [
    {
      method: "POST",
      path: "/api/data/thunk-errors/report",
      summary: "Report unexpected Redux thunk failure",
      requestBody: {
        contentType: "application/json",
        example: {
          thunkName: "refreshJobsThunk",
          message: "Network error",
          stack: "Error: …",
          context: { jobId: "uuid" },
        },
      },
      responses: [
        { status: 200, description: "Logged", example: successEnvelope({ id: "uuid" }) },
        { status: 400, description: "Validation error", example: errorEnvelope("message is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to report") },
      ],
    },
    {
      method: "POST",
      path: "/api/data/ui-errors/report",
      summary: "Report client UI error boundary event",
      requestBody: {
        contentType: "application/json",
        example: {
          message: "Cannot read property of undefined",
          componentStack: "at JobList …",
          severity: "error",
        },
      },
      responses: [
        { status: 200, description: "Logged", example: successEnvelope({ id: "uuid" }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to report") },
      ],
    },
    {
      method: "POST",
      path: "/api/data/api-errors/report",
      summary: "Report API transport or parse failure",
      requestBody: {
        contentType: "application/json",
        example: {
          url: "/api/data/job/list",
          httpStatus: 500,
          message: "Empty response",
          severity: "error",
        },
      },
      responses: [
        { status: 200, description: "Logged", example: successEnvelope({ id: "uuid" }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to report") },
      ],
    },
  ],
});

const buildTechnicalSkillsGroup = (): ApiDocsGroup => ({
  name: "Technical Skills Studio",
  description:
    "Per-user technical skills rows and coach chat. Load skills, patch rows, send coach messages, and accept AI skill suggestions.",
  endpoints: [
    {
      method: "GET",
      path: "/api/technical-skills/",
      summary: "Load skills studio state",
      responses: [
        {
          status: 200,
          description: "Skills and recent exchanges",
          example: successEnvelope({ skills: [], exchanges: [] }),
        },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to load") },
      ],
    },
    {
      method: "PATCH",
      path: "/api/technical-skills/skills",
      summary: "Replace skill rows",
      requestBody: {
        contentType: "application/json",
        example: { skills: [{ name: "TypeScript", level: "expert", active: true }] },
      },
      responses: [
        { status: 200, description: "Updated skills", example: successEnvelope({ skills: [] }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to patch") },
      ],
    },
    {
      method: "POST",
      path: "/api/technical-skills/messages",
      summary: "Send coach message",
      requestBody: {
        contentType: "application/json",
        example: { message: "Help me prioritize skills for a backend role" },
      },
      responses: [
        {
          status: 200,
          description: "Coach reply",
          example: successEnvelope({ reply: "Focus on…", suggestions: [] }),
        },
        { status: 500, description: "Server error", example: errorEnvelope("Coach failed") },
      ],
    },
    {
      method: "POST",
      path: "/api/technical-skills/suggestions/:suggestionId/accept",
      summary: "Accept a skill suggestion from coach",
      requestBody: {
        contentType: "application/json",
        example: {},
      },
      responses: [
        { status: 200, description: "Suggestion applied", example: successEnvelope({ skills: [] }) },
        { status: 400, description: "Invalid suggestion", example: errorEnvelope("Not found") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to accept") },
      ],
    },
  ],
});

const buildProfessionalBackgroundGroup = (): ApiDocsGroup => ({
  name: "Professional Background Studio",
  description:
    "Education and narrative segments for resume background. Load and patch segment text used in generation flows.",
  endpoints: [
    {
      method: "GET",
      path: "/api/professional-background/",
      summary: "Load professional background segments",
      responses: [
        {
          status: 200,
          description: "Segment map",
          example: successEnvelope({ segments: { education: "", summary: "" } }),
        },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to load") },
      ],
    },
    {
      method: "PATCH",
      path: "/api/professional-background/",
      summary: "Update professional background segments",
      requestBody: {
        contentType: "application/json",
        example: { segments: { education: "BS Computer Science", summary: "Full-stack engineer…" } },
      },
      responses: [
        { status: 200, description: "Updated segments", example: successEnvelope({ segments: {} }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to patch") },
      ],
    },
  ],
});

const buildJobStudioGroup = (): ApiDocsGroup => ({
  name: "Job Studio",
  description: "Per-job coach chat for tailoring application strategy. Load exchanges and post messages in job context.",
  endpoints: [
    {
      method: "GET",
      path: "/api/job-studio/",
      summary: "Load job studio state",
      queryParams: [{ name: "jobId", description: "Job UUID", required: true }],
      responses: [
        {
          status: 200,
          description: "Exchanges for job",
          example: successEnvelope({ exchanges: [] }),
        },
        { status: 400, description: "Missing jobId", example: errorEnvelope("jobId is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to load") },
      ],
    },
    {
      method: "POST",
      path: "/api/job-studio/messages",
      summary: "Send job studio coach message",
      requestBody: {
        contentType: "application/json",
        example: { jobId: "uuid", message: "How should I frame my experience for this role?" },
      },
      responses: [
        {
          status: 200,
          description: "Coach reply",
          example: successEnvelope({ reply: "Emphasize…", exchanges: [] }),
        },
        { status: 400, description: "Validation error", example: errorEnvelope("jobId is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Coach failed") },
      ],
    },
  ],
});

const buildUserBackgroundStudioGroup = (): ApiDocsGroup => ({
  name: "User Background Studio",
  description:
    "ICP / background coach with writer profiles, versioned segment drafts, and chat. Manage profiles, duplicate versions, and accept segment suggestions.",
  endpoints: [
    {
      method: "GET",
      path: "/api/user-background-studio/writer-settings",
      summary: "Load writer settings",
      responses: [
        { status: 200, description: "Writer settings", example: successEnvelope({ tone: "professional" }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to load") },
      ],
    },
    {
      method: "PATCH",
      path: "/api/user-background-studio/writer-settings",
      summary: "Update writer settings",
      requestBody: {
        contentType: "application/json",
        example: { tone: "concise" },
      },
      responses: [
        { status: 200, description: "Updated settings", example: successEnvelope({ tone: "concise" }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to patch") },
      ],
    },
    {
      method: "GET",
      path: "/api/user-background-studio/profiles",
      summary: "List background profiles",
      responses: [
        { status: 200, description: "Profile list", example: successEnvelope([{ id: "uuid", label: "Default" }]) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to list") },
      ],
    },
    {
      method: "POST",
      path: "/api/user-background-studio/profiles",
      summary: "Create background profile",
      requestBody: {
        contentType: "application/json",
        example: { label: "Staff engineer pitch" },
      },
      responses: [
        { status: 200, description: "Created profile", example: successEnvelope({ id: "uuid", label: "Staff engineer pitch" }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to create") },
      ],
    },
    {
      method: "GET",
      path: "/api/user-background-studio/profiles/:profileId",
      summary: "Get profile with versions",
      responses: [
        {
          status: 200,
          description: "Profile detail",
          example: successEnvelope({ id: "uuid", versions: [] }),
        },
        { status: 404, description: "Not found", example: errorEnvelope("Not found") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to get") },
      ],
    },
    {
      method: "PATCH",
      path: "/api/user-background-studio/profiles/:profileId",
      summary: "Update profile metadata",
      requestBody: {
        contentType: "application/json",
        example: { label: "Updated label" },
      },
      responses: [
        { status: 200, description: "Updated profile", example: successEnvelope({ id: "uuid" }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to patch") },
      ],
    },
    {
      method: "POST",
      path: "/api/user-background-studio/profiles/:profileId/messages",
      summary: "Send coach message for profile",
      requestBody: {
        contentType: "application/json",
        example: { message: "Help me refine my summary" },
      },
      responses: [
        { status: 200, description: "Coach reply", example: successEnvelope({ reply: "Try…" }) },
        { status: 500, description: "Server error", example: errorEnvelope("Coach failed") },
      ],
    },
    {
      method: "POST",
      path: "/api/user-background-studio/profiles/:profileId/segment-suggestions/:suggestionId/accept",
      summary: "Accept segment suggestion",
      responses: [
        { status: 200, description: "Suggestion applied", example: successEnvelope({ segments: {} }) },
        { status: 400, description: "Invalid suggestion", example: errorEnvelope("Not found") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to accept") },
      ],
    },
    {
      method: "PATCH",
      path: "/api/user-background-studio/profiles/:profileId/versions/:versionNumber/label",
      summary: "Rename a version label",
      requestBody: {
        contentType: "application/json",
        example: { label: "v2 — backend focus" },
      },
      responses: [
        { status: 200, description: "Updated version", example: successEnvelope({ versionNumber: 2 }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to patch") },
      ],
    },
    {
      method: "POST",
      path: "/api/user-background-studio/profiles/:profileId/versions/duplicate",
      summary: "Duplicate current version",
      responses: [
        { status: 200, description: "New version", example: successEnvelope({ versionNumber: 3 }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to duplicate") },
      ],
    },
    {
      method: "POST",
      path: "/api/user-background-studio/profiles/:profileId/versions/blank",
      summary: "Create blank version",
      responses: [
        { status: 200, description: "Blank version", example: successEnvelope({ versionNumber: 4 }) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to create") },
      ],
    },
    {
      method: "DELETE",
      path: "/api/user-background-studio/profiles/:profileId/versions/:versionNumber",
      summary: "Delete a version",
      responses: [
        { status: 200, description: "Deleted", example: successEnvelope({ versionNumber: 2 }) },
        { status: 400, description: "Cannot delete last version", example: errorEnvelope("Cannot delete") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to delete") },
      ],
    },
  ],
});

const buildLinkedInProfileGroup = (): ApiDocsGroup => ({
  name: "LinkedIn profile",
  description:
    "Tenant LinkedIn profile synced from Apify via linkedin-scraper-express-server. Normalized employment, education, and certification rows.",
  endpoints: [
    {
      method: "GET",
      path: "/api/data/linkedin-profile/get-tenant",
      summary: "Get tenant LinkedIn profile",
      responses: [
        { status: 200, description: "Profile or null", example: successEnvelope(null) },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to load") },
      ],
    },
    {
      method: "POST",
      path: "/api/data/linkedin-profile/create-tenant",
      summary: "Create tenant LinkedIn profile URL",
      requestBody: {
        contentType: "application/json",
        example: { linkedinUrl: "https://www.linkedin.com/in/example" },
      },
      responses: [
        { status: 200, description: "Created profile", example: successEnvelope({ id: "uuid" }) },
        { status: 400, description: "Validation error", example: errorEnvelope("linkedinUrl is required") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to create") },
      ],
    },
    {
      method: "PATCH",
      path: "/api/data/linkedin-profile/update-tenant-url",
      summary: "Update tenant LinkedIn profile URL",
      requestBody: {
        contentType: "application/json",
        example: { linkedinUrl: "https://www.linkedin.com/in/example" },
      },
      responses: [
        { status: 200, description: "Updated profile", example: successEnvelope({ id: "uuid" }) },
        { status: 400, description: "Validation error", example: errorEnvelope("Tenant LinkedIn profile is not configured") },
        { status: 500, description: "Server error", example: errorEnvelope("Failed to update") },
      ],
    },
    {
      method: "POST",
      path: "/api/data/linkedin-profile/sync-tenant",
      summary: "Sync tenant profile from LinkedIn scraper",
      responses: [
        {
          status: 200,
          description: "Profile bundle",
          example: successEnvelope({
            profile: { id: "uuid" },
            employments: [],
            educations: [],
            certifications: [],
          }),
        },
        { status: 400, description: "Not configured", example: errorEnvelope("Tenant LinkedIn profile is not configured") },
        { status: 500, description: "Server error", example: errorEnvelope("Sync failed") },
      ],
    },
  ],
});

/**
 * Builds the full API documentation catalog for Code Your Resume Express.
 */
export const buildApiDocsCatalog = (): ApiDocsCatalog => {
  const portFromEnv = Number(process.env.PORT);
  const port =
    Number.isFinite(portFromEnv) && portFromEnv > 0 ? portFromEnv : DEFAULT_PORT;
  const baseUrl =
    process.env.PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
    `http://localhost:${port}`;

  const groups: ApiDocsGroup[] = [
    buildOverviewGroup(),
    buildHealthGroup(),
    buildCompaniesGroup(),
    buildJobsGroup(),
    buildJobListingSectionListGroup(
      "Job responsibilities",
      "/api/data/job-responsibilities",
      "responsibility rows",
      "AI-extracted or imported responsibility bullets for a job. Read-only list filtered by `jobId`.",
    ),
    buildJobListingSectionListGroup(
      "Job requirements",
      "/api/data/job-requirements",
      "requirement rows",
      "Required qualifications extracted from a job listing. Read-only list filtered by `jobId`.",
    ),
    buildJobListingSectionListGroup(
      "Job nice-to-haves",
      "/api/data/job-nice-to-haves",
      "nice-to-have rows",
      "Preferred skills extracted from a job listing. Read-only list filtered by `jobId`.",
    ),
    buildJobQuestionsGroup(),
    buildJobQuestionAnswersGroup(),
    buildLinkedInProfileGroup(),
    buildImageGraphicsGroup(),
    buildGenerationGroup(
      "Skills component generation",
      "/api/data/skills-component/generate",
      "Generate TSX skills component for a job",
      "Cursor/AI-generated TSX block using active technical skills and job context. Requires `CURSOR_API_KEY` or configured generation backend.",
    ),
    buildGenerationGroup(
      "Cover letter generation",
      "/api/data/cover-letter/generate",
      "Generate TSX cover letter for a job",
      "AI-generated cover letter TSX using job listing, company research, and professional background voice.",
    ),
    buildGenerationGroup(
      "Company interest generation",
      "/api/data/company-interest/generate",
      "Generate company interest TSX for a job",
      "AI-generated why-this-company paragraph TSX tailored to the job and company research summary.",
    ),
    buildGenerationGroup(
      "Team conversation generation",
      "/api/data/team-conversation/generate",
      "Generate team conversation TSX for a job",
      "AI-generated YC-style conversation opener — share about you, what you're looking for, or why the company interests you.",
    ),
    buildErrorReportingGroup(),
    buildTechnicalSkillsGroup(),
    buildProfessionalBackgroundGroup(),
    buildJobStudioGroup(),
    buildUserBackgroundStudioGroup(),
  ];

  return {
    version: "1.0.0",
    baseUrl,
    responseEnvelope: '{ "success": true, "data": T } | { "success": false, "error": string }',
    groups,
  };
};
