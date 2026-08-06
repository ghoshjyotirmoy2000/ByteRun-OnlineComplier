import type { RunResult, SubmissionJob } from "../types";
import { runDocker } from "./docker/docker.runner";

export const runCpp = async (job: SubmissionJob): Promise<RunResult> => {
  console.log("Running C++ code inside Docker...");

  const startTime = Date.now();

  try {
    const script = `
mkdir -p /app && \
cd /app && \
cat <<'EOF' > main.cpp
${job.code}
EOF
g++ -O2 -o main main.cpp && ./main
`;

    const result = await runDocker({
      image: "gcc:13",
      containerName: `submission-${job.submissionId}`,
      command: ["sh", "-c", script],
      timeoutMs: 10000,
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
      // Covers both g++ compile errors and non-zero runtime exits; the
      // compiler's own message on stderr is passed through as-is.
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
    console.error(
      `Docker execution failed for submission ${job.submissionId}:`,
      err,
    );

    return {
      output: "",
      executionTime: Date.now() - startTime,
      error: "INTERNAL_ERROR",
    };
  }
};
