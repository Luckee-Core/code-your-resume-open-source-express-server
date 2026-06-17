import type { ProjectNote } from "../../data/project-notes/types";
import { requireCrmSupabaseClient } from "../../data/crm/require-crm-supabase-client";
import { createProjectNote } from "../../data/project-notes/create";
import { deleteProjectNotesByProjectId } from "../../data/project-notes/delete-by-project-id";
import { getProjectById } from "../../data/projects/get-by-id";
import { persistProjectNotesSynthesisLedger } from "./persist-project-notes-synthesis-ledger";

export const MIN_PROJECT_SYNTHESIS_CHARS = 40;
export const MAX_PROJECT_SYNTHESIS_CHARS = 32_000;

export type RunProjectNotesSynthesisResult =
  | { ok: true; notes: ProjectNote[]; exchangeId: string }
  | { ok: false; statusCode: 400 | 404 | 422 | 500; error: string };

/**
 * Runs the project notes synthesis pipeline: AI extract, replace all notes for the project.
 */
export const runProjectNotesSynthesis = async (input: {
  projectId: string;
  synthesisText: string;
}): Promise<RunProjectNotesSynthesisResult> => {
  const projectId = input.projectId.trim();
  const trimmed = input.synthesisText.trim();

  if (!projectId) {
    return { ok: false, statusCode: 400, error: "id is required" };
  }

  if (trimmed.length < MIN_PROJECT_SYNTHESIS_CHARS) {
    return {
      ok: false,
      statusCode: 400,
      error: `Synthesis text must be at least ${MIN_PROJECT_SYNTHESIS_CHARS} characters`,
    };
  }

  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    return {
      ok: false,
      statusCode: 500,
      error: "Anthropic API key is not configured on the server",
    };
  }

  const cappedText =
    trimmed.length > MAX_PROJECT_SYNTHESIS_CHARS
      ? trimmed.slice(0, MAX_PROJECT_SYNTHESIS_CHARS)
      : trimmed;

  console.log("🚀 runProjectNotesSynthesis: start", {
    projectId,
    synthesisChars: trimmed.length,
    cappedChars: cappedText.length,
  });

  const supabase = requireCrmSupabaseClient();

  let project;
  try {
    project = await getProjectById(supabase, projectId);
  } catch {
    return { ok: false, statusCode: 500, error: "Failed to load project" };
  }

  if (!project) {
    return { ok: false, statusCode: 404, error: "Project not found" };
  }

  const ledgerResult = await persistProjectNotesSynthesisLedger({
    project,
    synthesisText: cappedText,
  });

  if (!ledgerResult.ok) {
    return { ok: false, statusCode: 500, error: ledgerResult.error };
  }

  const { exchangeId, notes: noteBodies } = ledgerResult;

  if (noteBodies.length === 0) {
    return {
      ok: false,
      statusCode: 422,
      error: "Could not extract any project notes from this text",
    };
  }

  try {
    await deleteProjectNotesByProjectId(supabase, projectId);

    const createdNotes: ProjectNote[] = [];
    for (const body of noteBodies) {
      const note = await createProjectNote(supabase, { projectId, body });
      createdNotes.push(note);
    }

    createdNotes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    console.log("✅ runProjectNotesSynthesis: notes replaced", {
      projectId,
      exchangeId,
      notesCount: createdNotes.length,
    });

    return { ok: true, notes: createdNotes, exchangeId };
  } catch (err) {
    console.error("❌ runProjectNotesSynthesis: failed to replace notes", {
      projectId,
      exchangeId,
      err,
    });
    return { ok: false, statusCode: 500, error: "Failed to save synthesized notes" };
  }
};
