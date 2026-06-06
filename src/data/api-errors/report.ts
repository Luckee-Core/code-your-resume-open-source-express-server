import type { Request, Response } from "express";
import { getSupabaseCrmMirrorClient } from "../../services/supabase/get-supabase-crm-mirror-client";
import { resolveAppErrorInsertMeta } from "../../utils/resolve-app-error-insert-meta";
import { insertApiError } from "./insert-api-error";
import type { ApiErrorSeverity } from "./types";

const SEVERITIES: ApiErrorSeverity[] = ["fatal", "error", "warning"];

type ReportBody = {
  event?: unknown;
  severity?: unknown;
  message?: unknown;
  stack?: unknown;
  httpMethod?: unknown;
  routePath?: unknown;
  statusCode?: unknown;
  upstream?: unknown;
};

/**
 * POST /api/data/api-errors/report — persist an API route / handler failure.
 */
export const handleApiErrorReport = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 POST /api/data/api-errors/report");
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
    const httpMethod = typeof body.httpMethod === "string" ? body.httpMethod.trim() : "";
    const routePath = typeof body.routePath === "string" ? body.routePath.trim() : "";
    if (!event || !message || !httpMethod || !routePath) {
      res
        .status(400)
        .json({ success: false, error: "event, message, httpMethod, and routePath are required" });
      return;
    }

    const severityRaw = typeof body.severity === "string" ? body.severity.trim() : "error";
    const severity = SEVERITIES.includes(severityRaw as ApiErrorSeverity)
      ? (severityRaw as ApiErrorSeverity)
      : "error";

    const stack = typeof body.stack === "string" ? body.stack : null;
    const statusCode =
      typeof body.statusCode === "number" && Number.isFinite(body.statusCode)
        ? body.statusCode
        : null;
    const upstream = typeof body.upstream === "string" ? body.upstream.trim() || null : null;

    const meta = resolveAppErrorInsertMeta();

    await insertApiError(supabase, {
      event,
      severity,
      message,
      stack,
      httpMethod,
      routePath,
      statusCode,
      upstream,
      appSlug: meta.appSlug,
      environment: meta.environment,
      release: meta.release,
    });

    console.log("📤 200 POST /api/data/api-errors/report");
    res.status(200).json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ POST /api/data/api-errors/report:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
