import { spawn } from "child_process";

interface DockerRunOptions {
  image: string;
  command: string[];
  containerName: string;
  timeoutMs?: number;
  stdin?: string;
}

interface DockerRunResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  outputLimitExceeded: boolean;
}

// Cap per-stream output so a runaway submission can't OOM the worker itself
// by buffering unbounded stdout/stderr in process memory.
const OUTPUT_LIMIT_BYTES = 100_000;

export const runDocker = ({
  image,
  command,
  containerName,
  timeoutMs = 2000,
  stdin,
}: DockerRunOptions): Promise<DockerRunResult> => {
  return new Promise((resolve, reject) => {
    const docker = spawn("docker", [
      "run",

      "--name",
      containerName,

      "--rm",

      "--interactive",

      "--network",
      "none",

      "--memory",
      "128m",

      "--cpus",
      "0.5",

      image,

      ...command,
    ]);

    docker.stdin.write(stdin ?? "");
    docker.stdin.end();

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let outputLimitExceeded = false;

    console.log("i am inside docker runner");

    // Killing the `docker run` CLI process alone does not stop the
    // container running inside the daemon, so we explicitly `docker kill`
    // the named container too.
    const killContainer = () => {
      spawn("docker", ["kill", containerName]).on("error", () => {});
      docker.kill("SIGKILL");
    };

    const timeout = setTimeout(() => {
      timedOut = true;
      console.log(`Timeout! Killing ${containerName}`);
      killContainer();
    }, timeoutMs);

    const enforceOutputLimit = () => {
      if (
        !outputLimitExceeded &&
        (stdout.length > OUTPUT_LIMIT_BYTES || stderr.length > OUTPUT_LIMIT_BYTES)
      ) {
        outputLimitExceeded = true;
        killContainer();
      }
    };

    docker.stdout.on("data", (data) => {
      if (outputLimitExceeded) return;
      stdout += data.toString();
      enforceOutputLimit();
    });

    docker.stderr.on("data", (data) => {
      if (outputLimitExceeded) return;
      stderr += data.toString();
      enforceOutputLimit();
    });

    docker.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    docker.on("close", (exitCode) => {
      clearTimeout(timeout);

      resolve({
        exitCode,
        stdout,
        stderr,
        timedOut,
        outputLimitExceeded,
      });
    });
  });
};
