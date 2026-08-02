export interface SubmissionJob {
  userId: string;
  submissionId: string;
  code: string;
  language: string;
  input?: string;
}

// Reserved for cases where the container was killed by us (or never ran),
// so there is no meaningful message from the submitted code itself.
// Syntax/runtime errors produced by the code are passed through verbatim
// instead of being mapped to one of these.
export type RunErrorCode =
  | ""
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "OUTPUT_LIMIT_EXCEEDED"
  | "UNSUPPORTED_LANGUAGE"
  | "INTERNAL_ERROR";

export interface RunResult {
  output: string;
  executionTime: number;
  error: RunErrorCode | string;
}
