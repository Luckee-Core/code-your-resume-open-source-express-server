import { Router, type Request, type Response } from "express";
import { getSupabaseCrmMirrorClient } from "../../services/supabase/get-supabase-crm-mirror-client";
import { resolveAppErrorInsertMeta } from "../../utils/resolve-app-error-insert-meta";
import { insertUiError } from "./insert-ui-error";
import type { UiErrorSeverity } from "./types";

const SEVERITIES: UiErrorSeverity[] = ["fatal", "error", "warning"];

type ReportBody = {
  event?: unknown;
  severity?: unknown;
  message?: unknown;
  stack?: unknown;
  routePath?: unknown;
  componentName?: unknown;
  digest?: unknown;
};

/**
 * Router for `ui_errors` — POST /api/data/ui-errors/report
 */
export const createUiErrorsRouter = (): Router => {
  const router = Router();

  /**
   * POST /api/data/ui-errors/report
   * Persists a UI / error-boundary failure from the Next client.
   */
  router.post("/report", async (req: Request, res: Response): Promise<void> => {
    try {
      const supabase = getSupabaseCrmMirrorClient();
      if (!supabase) {
        res.status(500).json({
          success: false,
          error: "Supabase client not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
        });
        return;
      }

      const body = req.body as ReportBody;
      const event = typeof body.event === "string" ? body.event.trim() : "";
      const message = typeof body.message === "string" ? body.message.trim() : "";
      const routePath = typeof body.routePath === "string" ? body.routePath.trim() : "";
      if (!event || !message || !routePath) {
        res.status(400).json({ success: false, error: "event, message, and routePath are required" });
        return;
      }

      const severityRaw = typeof body.severity === "string" ? body.severity.trim() : "error";
      const severity = SEVERITIES.includes(severityRaw as UiErrorSeverity)
        ? (severityRaw as UiErrorSeverity)
        : "error";

      const stack = typeof body.stack === "string" ? body.stack : null;
      const componentName =
        typeof body.componentName === "string" ? body.componentName.trim() || null : null;
      const digest = typeof body.digest === "string" ? body.digest.trim() || null : null;

      const meta = resolveAppErrorInsertMeta();

      await insertUiError(supabase, {
        event,
        severity,
        message,
        stack,
        routePath,
        componentName,
        digest,
        appSlug: meta.appSlug,
        environment: meta.environment,
        release: meta.release,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ POST /api/data/ui-errors/report:", msg);
      res.status(500).json({ success: false, error: msg });
    }
  });

  return router;
};
