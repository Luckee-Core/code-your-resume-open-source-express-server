import type { Project } from "../../data/projects/types";
import type { ProjectNote } from "../../data/project-notes/types";

export const EMPTY_PROJECTS_LABEL = "(no projects recorded)";

const EMPTY_LABEL = EMPTY_PROJECTS_LABEL;

/**
 * Format project notes for a single project (newest first).
 */
const formatNotesForProject = (notes: ProjectNote[]): string => {
  if (notes.length === 0) {
    return "";
  }
  return notes.map((note) => `- ${note.body.trim()}`).join("\n");
};

/**
 * Build a markdown-ish block of all projects for AI prompt templates.
 */
export const buildProjectsPromptBlock = (
  projects: Project[],
  notes: ProjectNote[],
): string => {
  if (projects.length === 0) {
    return EMPTY_LABEL;
  }

  const notesByProjectId = new Map<string, ProjectNote[]>();
  for (const note of notes) {
    const existing = notesByProjectId.get(note.projectId) ?? [];
    existing.push(note);
    notesByProjectId.set(note.projectId, existing);
  }

  return projects
    .map((project) => {
      const lines: string[] = [`### ${project.businessName.trim() || "Untitled project"}`];
      if (project.url.trim()) {
        lines.push(`URL: ${project.url.trim()}`);
      }
      if (project.description.trim()) {
        lines.push(`Description: ${project.description.trim()}`);
      }
      if (project.technologies.length > 0) {
        lines.push(`Technologies: ${project.technologies.join(", ")}`);
      }
      const projectNotes = notesByProjectId.get(project.id) ?? [];
      const notesBlock = formatNotesForProject(projectNotes);
      if (notesBlock) {
        lines.push("Notes:");
        lines.push(notesBlock);
      }
      return lines.join("\n");
    })
    .join("\n\n");
};
