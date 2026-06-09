import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3053;

// Early middleware setup
import { requireCrmApiSecretWhenConfigured, setupEarlyMiddleware } from "./src/services/middleware";
setupEarlyMiddleware(app);

// Health check routes
import { createHealthRouter } from "./src/services/health";
app.use("/", createHealthRouter());
app.use("/api/health", createHealthRouter());

// CRM Supabase action API
import { createApiDataRouter } from "./src/api/data/router";
app.use("/api/data", requireCrmApiSecretWhenConfigured);
app.use("/api/data", createApiDataRouter());

// Technical Skills Studio — skill rows and coach chat (Supabase-backed)
import { createTechnicalSkillsRouter } from "./src/api/technical-skills/router";
app.use("/api/technical-skills", requireCrmApiSecretWhenConfigured);
app.use("/api/technical-skills", createTechnicalSkillsRouter());

// Professional Background — education + narrative segments (Supabase-backed)
import { createProfessionalBackgroundRouter } from "./src/api/professional-background/router";
app.use("/api/professional-background", requireCrmApiSecretWhenConfigured);
app.use("/api/professional-background", createProfessionalBackgroundRouter());

// Job Studio — per-job coach chat (Supabase-backed)
import { createJobStudioRouter } from "./src/api/job-studio/router";
app.use("/api/job-studio", requireCrmApiSecretWhenConfigured);
app.use("/api/job-studio", createJobStudioRouter());

// User Background Studio — ICP / background coach (Supabase-backed)
import { createUserBackgroundStudioRouter } from "./src/api/user-background-studio/router";
app.use("/api/user-background-studio", requireCrmApiSecretWhenConfigured);
app.use("/api/user-background-studio", createUserBackgroundStudioRouter());

// Job newsletter ingest — pull from email-manager, AI parse into CRM jobs
import { createJobNewsletterIngestRouter } from "./src/api/job-newsletter-ingest/router";
app.use("/api/job-newsletter-ingest", requireCrmApiSecretWhenConfigured);
app.use("/api/job-newsletter-ingest", createJobNewsletterIngestRouter());

// API documentation catalog (metadata only — no CRM secret)
import { createApiDocsRouter } from "./src/services/api-docs";
app.use(createApiDocsRouter());

// Error handling middleware (must be after all routes)
import { setupErrorHandling } from "./src/services/middleware";
setupErrorHandling(app);

// Start server (ensure CRM dir exists before listen)
import { startServer } from "./src/services/server";
import { ensureCrmDataDirAtStartup } from "./src/services/crm";
import { ensureJobListingDataDirAtStartup } from "./src/services/job/ensure-job-listing-data-dir-at-startup";
import { getSupabaseCrmMirrorClient } from "./src/services/supabase/get-supabase-crm-mirror-client";

void (async () => {
  try {
    await ensureCrmDataDirAtStartup();
    await ensureJobListingDataDirAtStartup();
  } catch (err) {
    console.error("❌ Failed to initialize CRM / job-listing data directories:", err);
    process.exit(1);
  }
  const supabase = getSupabaseCrmMirrorClient();
  if (!supabase) {
    console.error(
      "❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required — CRM always uses Supabase.",
    );
    process.exit(1);
  }
  console.log("✅ Supabase configured (CRM, graphics, technical skills, job studio, …)");
  startServer(app, {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    host: process.env.HOST,
  });
})();

export default app;
