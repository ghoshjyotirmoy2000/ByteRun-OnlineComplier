import axios from "axios";
import type { RunResult } from "../types";

const RETRY_DELAYS_MS = [500, 1500, 4000];

export const reportSubmissionResult = async (
  submissionId: string,
  result: RunResult,
) => {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      await axios.post(
        `${process.env.BACKEND_URL}/api/v1/internal/submission-result/${submissionId}`,
        result,
        {
          headers: {
            Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
          },
        },
      );
      return;
    } catch (err) {
      const isLastAttempt = attempt === RETRY_DELAYS_MS.length;

      if (isLastAttempt) {
        console.error(
          `Failed to report result for submission ${submissionId} after ${attempt + 1} attempts, giving up:`,
          err,
        );
        return;
      }

      console.error(
        `Failed to report result for submission ${submissionId} (attempt ${attempt + 1}), retrying...`,
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }
  }
};
