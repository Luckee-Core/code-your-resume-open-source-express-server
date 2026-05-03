/**
 * Setup Early Middleware
 * Configures CORS, body parsing, and other early middleware
 */

import cors from "cors";
import express, { Express } from "express";

const defaultDevOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

/** Cap JSON bodies to reduce accidental huge payloads / abuse (CRM payloads are small). */
const JSON_BODY_LIMIT = "1mb";

const parseCorsOrigins = (): string[] | true => {
  const raw = process.env.CORS_ORIGINS?.trim();
  const isProd = process.env.NODE_ENV === "production";
  if (!raw) {
    return defaultDevOrigins;
  }
  if (raw === "*") {
    if (isProd) {
      console.warn(
        "⚠️ CORS_ORIGINS=* is unsafe in production; using localhost defaults only. Set a comma-separated allowlist.",
      );
      return defaultDevOrigins;
    }
    return true;
  }
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : defaultDevOrigins;
};

export const setupEarlyMiddleware = (app: Express): void => {
  const origin = parseCorsOrigins();
  app.use(
    cors(
      origin === true
        ? {}
        : {
            origin,
            methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "X-CRM-API-Key"],
          },
    ),
  );

  app.use(express.json({ limit: JSON_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: JSON_BODY_LIMIT }));
};
