export type ProjectNoteRow = {
  id: string;
  project_id: string;
  body: string;
  created_at: string;
};

export type ProjectNote = {
  id: string;
  projectId: string;
  body: string;
  createdAt: string;
};

export type CreateProjectNoteInput = {
  projectId: string;
  body: string;
};
