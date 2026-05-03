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

// CRM JSON vault + action API
import { createApiDataRouter } from "./src/api/data/router";
app.use("/api/data", requireCrmApiSecretWhenConfigured);
app.use("/api/data", createApiDataRouter());

// Technical Skills Studio — skill rows and coach chat (Supabase-backed)
import { createTechnicalSkillsRouter } from "./src/api/technical-skills/router";
app.use("/api/technical-skills", requireCrmApiSecretWhenConfigured);
app.use("/api/technical-skills", createTechnicalSkillsRouter());

// Error handling middleware (must be after all routes)
import { setupErrorHandling } from "./src/services/middleware";
setupErrorHandling(app);

// Start server (ensure CRM dir exists before listen)
import { startServer } from "./src/services/server";
import { ensureCrmDataDirAtStartup } from "./src/services/crm";
import { ensureJobListingDataDirAtStartup } from "./src/services/job/ensure-job-listing-data-dir-at-startup";

void (async () => {
  try {
    await ensureCrmDataDirAtStartup();
    await ensureJobListingDataDirAtStartup();
  } catch (err) {
    console.error("❌ Failed to initialize CRM / job-listing data directories:", err);
    process.exit(1);
  }
  startServer(app, {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
  });
})();

export default app;
