/**
 * When `CRM_API_SECRET` is set, requires matching `X-CRM-API-Key` or `Authorization: Bearer`.
 * Omit the env var for open local-only stacks (bind Express to 127.0.0.1 — see `HOST`).
 */

import type { NextFunction, Request, Response } from "express";

const HEADER = "x-crm-api-key";

/**
 * Rejects requests to protected routes unless the shared secret matches `CRM_API_SECRET`.
 */
export const requireCrmApiSecretWhenConfigured = (req: Request, res: Response, next: NextFunction): void => {
  const secret = process.env.CRM_API_SECRET?.trim();
  if (!secret) {
    next();
    return;
  }

  const fromHeader = req.headers[HEADER];
  const headerValue = typeof fromHeader === "string" ? fromHeader : undefined;
  const bearer =
    typeof req.headers.authorization === "string" && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.slice("Bearer ".length)
      : undefined;
  const presented = headerValue ?? bearer;

  if (presented !== secret) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  next();
};
