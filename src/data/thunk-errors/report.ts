import type { Request, Response } from "express";
import { getSupabaseCrmMirrorClient } from "../../services/supabase/get-supabase-crm-mirror-client";
import { resolveAppErrorInsertMeta } from "../../utils/resolve-app-error-insert-meta";
import { insertThunkError } from "./insert-thunk-error";
import type { ThunkErrorSeverity } from "./types";

const SEVERITIES: ThunkErrorSeverity[] = ["fatal", "error", "warning"];

type ReportBody = {
  event?: unknown;
  severity?: unknown;
  message?: unknown;
  stack?: unknown;
  thunkName?: unknown;
  collection?: unknown;
  entityId?: unknown;
  userId?: unknown;
};

/**
 * POST /api/data/thunk-errors/report — persist an unexpected thunk failure from the Next client.
 */
export const handleThunkErrorReport = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 POST /api/data/thunk-errors/report");
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
    if (!event || !message) {
      res.status(400).json({ success: false, error: "event and message are required" });
      return;
    }

    const severityRaw = typeof body.severity === "string" ? body.severity.trim() : "error";
    const severity = SEVERITIES.includes(severityRaw as ThunkErrorSeverity)
      ? (severityRaw as ThunkErrorSeverity)
      : "error";

    const stack = typeof body.stack === "string" ? body.stack : null;
    const thunkName = typeof body.thunkName === "string" ? body.thunkName.trim() || null : null;
    const collection = typeof body.collection === "string" ? body.collection.trim() || null : null;
    const entityId = typeof body.entityId === "string" ? body.entityId.trim() || null : null;
    const userId = typeof body.userId === "string" ? body.userId.trim() || null : null;

    const meta = resolveAppErrorInsertMeta();

    await insertThunkError(supabase, {
      event,
      severity,
      message,
      stack,
      thunkName,
      collection,
      entityId,
      userId,
      appSlug: meta.appSlug,
      environment: meta.environment,
      release: meta.release,
    });

    console.log("📤 200 POST /api/data/thunk-errors/report");
    res.status(200).json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ POST /api/data/thunk-errors/report:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
