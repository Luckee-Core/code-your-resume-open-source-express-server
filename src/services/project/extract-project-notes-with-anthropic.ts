import Anthropic from "@anthropic-ai/sdk";
import { getModelConfig } from "../ai/model-config";
import type { Project } from "../../data/projects/types";

const SYNTHESIS_MODEL = getModelConfig("project_notes_synthesis");

const MAX_NOTES = 30;
const MAX_NOTE_CHARS = 2000;

const normalizeNotesArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const t = item.trim();
    if (!t) continue;
    out.push(t.length > MAX_NOTE_CHARS ? t.slice(0, MAX_NOTE_CHARS) : t);
    if (out.length >= MAX_NOTES) break;
  }
  return out;
};

export type ExtractProjectNotesOutcome =
  | { kind: "skipped" }
  | {
      kind: "ok";
      notes: string[];
      rawResponse: string;
      usageInputTokens: number | null;
      usageOutputTokens: number | null;
      systemPrompt: string;
      userMessage: string;
    }
  | {
      kind: "error";
      message: string;
      rawResponse: string;
      systemPrompt: string;
      userMessage: string;
    };

/**
 * Builds the user message for project notes synthesis from project context and pasted blob.
 */
export const buildProjectNotesSynthesisUserMessage = (
  project: Project,
  synthesisText: string,
): string => {
  const techList =
    project.technologies.length > 0 ? project.technologies.join(", ") : "(none listed)";

  return [
    "Project context:",
    `Business: ${project.businessName.trim() || "(untitled)"}`,
    project.description.trim() ? `Description: ${project.description.trim()}` : "",
    `Technologies: ${techList}`,
    "",
    "Pasted narrative follows:",
    "---",
    synthesisText,
  ]
    .filter(Boolean)
    .join("\n");
};

/**
 * Calls Anthropic to extract resume-ready project notes from pasted narrative text.
 */
export const extractProjectNotesWithAnthropic = async (
  project: Project,
  synthesisText: string,
  options: { systemPrompt: string },
): Promise<ExtractProjectNotesOutcome> => {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    return { kind: "skipped" };
  }

  const systemPrompt = options.systemPrompt.trim();
  if (!systemPrompt) {
    return {
      kind: "error",
      message: "Missing project notes synthesis system prompt",
      rawResponse: "",
      systemPrompt: "",
      userMessage: "",
    };
  }

  const userMessage = buildProjectNotesSynthesisUserMessage(project, synthesisText);
  const userMessageSent = userMessage.slice(0, 100_000);
  const client = new Anthropic({ apiKey: key });

  console.log("📥 project-notes synthesis: sending to Anthropic", {
    projectId: project.id,
    model: SYNTHESIS_MODEL.model,
    synthesisChars: synthesisText.length,
  });

  try {
    const msg = await client.messages.create({
      model: SYNTHESIS_MODEL.model,
      max_tokens: SYNTHESIS_MODEL.maxTokens,
      temperature: SYNTHESIS_MODEL.temperature,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessageSent }],
    });

    const block = msg.content.find((b: { type: string }) => b.type === "text");
    const rawResponse = block && block.type === "text" ? block.text.trim() : "";

    const usageInputTokens =
      typeof msg.usage?.input_tokens === "number" ? msg.usage.input_tokens : null;
    const usageOutputTokens =
      typeof msg.usage?.output_tokens === "number" ? msg.usage.output_tokens : null;

    let notes: string[] = [];

    try {
      const strip = rawResponse.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      const parsed = JSON.parse(strip) as Record<string, unknown>;
      notes = normalizeNotesArray(parsed.notes);
      console.log("✅ project-notes synthesis: JSON parsed", {
        projectId: project.id,
        notesCount: notes.length,
      });
    } catch (parseErr) {
      console.warn("⚠️ project-notes synthesis: JSON.parse failed", {
        projectId: project.id,
        error: parseErr instanceof Error ? parseErr.message : String(parseErr),
      });
      return {
        kind: "error",
        message: "Could not parse AI response as JSON",
        rawResponse,
        systemPrompt,
        userMessage: userMessageSent,
      };
    }

    return {
      kind: "ok",
      notes,
      rawResponse,
      usageInputTokens,
      usageOutputTokens,
      systemPrompt,
      userMessage: userMessageSent,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Anthropic request failed";
    return {
      kind: "error",
      message,
      rawResponse: "",
      systemPrompt,
      userMessage: userMessageSent,
    };
  }
};

/**
 * Returns the Anthropic model id used for project notes synthesis.
 */
export const getAnthropicProjectNotesSynthesisModel = (): string => SYNTHESIS_MODEL.model;
