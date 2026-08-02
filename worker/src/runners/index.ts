import type { RunResult, SubmissionJob } from "../types";
import { runCpp } from "./cpp.runner";
import { runJava } from "./java.runner";
import { runJavascript } from "./javascript.runner";
import { runPython } from "./python.runner";

type Runner = (job: SubmissionJob) => Promise<RunResult>;

const runners: Record<string, Runner> = {
  java: runJava,
  javascript: runJavascript,
  cpp: runCpp,
  python: runPython,
};

export const runCode = async (job: SubmissionJob): Promise<RunResult> => {
  const runner = runners[job.language];

  if (!runner) {
    console.log(`Unsupported language: ${job.language}`);
    return {
      output: "",
      executionTime: 0,
      error: "UNSUPPORTED_LANGUAGE",
    };
  }

  return runner(job);
};
