export type JobNewsletterSource = {
  id: string;
  name: string;
  sender_email: string;
  enabled: boolean;
  parse_instructions: string;
  created_at: string;
  updated_at: string;
};

export type CreateJobNewsletterSourceInput = {
  name: string;
  sender_email: string;
  enabled?: boolean;
  parse_instructions: string;
};

export type UpdateJobNewsletterSourceInput = {
  name?: string;
  sender_email?: string;
  enabled?: boolean;
  parse_instructions?: string;
};
