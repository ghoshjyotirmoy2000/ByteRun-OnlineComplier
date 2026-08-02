export const LANGUAGES = ["javascript", "python", "java", "cpp"] as const;

export type Language = (typeof LANGUAGES)[number];

export interface RunCodePayload {
  code: string;
  language: Language;
  input?: string;
}

export interface Submission {
  id: string;
  userId: string;
  status: string;
  language: string;
  input: string;
  output: string | null;
  error: string | null;
  executionTime: number | null;
}
