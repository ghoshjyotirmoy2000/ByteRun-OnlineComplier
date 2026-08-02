import type { RunResult, SubmissionJob } from "../types";
import { runDocker } from "./docker/docker.runner";

export const runJava = async (job: SubmissionJob): Promise<RunResult> => {
  console.log("Running Java code in Docker...");

  const startTime = Date.now();

  try {
    const script = `
mkdir -p /app && \
cd /app && \
cat <<'EOF' > Main.java
${job.code}
EOF
javac Main.java && java Main
`;

    const result = await runDocker({
      image: "eclipse-temurin:21-jdk",
      containerName: `submission-${job.submissionId}`,
      command: ["sh", "-c", script],
      timeoutMs: 10000,
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
