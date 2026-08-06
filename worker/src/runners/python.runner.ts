import type { RunResult, SubmissionJob } from "../types";
import { runDocker } from "./docker/docker.runner";

export const runPython = async (job: SubmissionJob): Promise<RunResult> => {
  console.log("Running Python code inside Docker...");

  const startTime = Date.now();

  try {
    const result = await runDocker({
      image: "python:3.12-alpine",
      containerName: `submission-${job.submissionId}`,
      command: ["python3", "-c", job.code],
      timeoutMs: 5000,
      stdin: job.input,
    });

    const executionTime = Date.now() - startTime;

    if (result.outputLimitExceeded) {
      return {
        output: result.stdout,
        executionTime,
        error: "OUTPUT_LIMIT_EXCEEDED",
      };
    }

    if (result.timedOut) {
      return {
        output: result.stdout,
        executionTime,
        error: "TIME_LIMIT_EXCEEDED",
      };
    }

    if (result.exitCode === 137) {
      return {
        output: result.stdout,
        executionTime,
        error: "MEMORY_LIMIT_EXCEEDED",
      };
    }

    if (result.exitCode !== 0) {
      // python3 -c has no separate compile step, so SyntaxError and runtime
      // errors both just come out as a non-zero exit + a self-labeled
      // traceback on stderr. Pass it through as-is rather than collapsing it.
      return {
        output: result.stdout,
        executionTime,
        error: result.stderr,
      };
    }

    return {
      output: result.stdout,
      executionTime,
      error: "",
    };
  } catch (err) {
    console.error(`Docker execution failed for submission ${job.submissionId}:`, err);
    return {
      output: "",
      executionTime: Date.now() - startTime,
      error: "INTERNAL_ERROR",
    };
  }
};
