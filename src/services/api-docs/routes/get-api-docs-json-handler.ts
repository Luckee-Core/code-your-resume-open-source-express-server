import type { Request, Response } from "express";
import { buildApiDocsCatalog } from "../api-docs-catalog";

/**
 * Handles GET /api-docs.json — returns the API documentation catalog (metadata only; no Supabase).
 */
export const getApiDocsJsonHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api-docs.json");

  try {
    const catalog = buildApiDocsCatalog();
    console.log("📤 GET /api-docs.json 200");
    res.status(200).json({ success: true, data: catalog });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("❌ GET /api-docs.json:", message);
    res.status(500).json({ success: false, error: message });
  }
};
