import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { runCode } from "./api";
import socket from "../../lib/websockets";
import type { Submission } from "./types";

export const useRunCode = () => useMutation({ mutationFn: runCode });

export function useSubmissionResult(submissionId: string | null) {
  const [result, setResult] = useState<Submission | null>(null);

  useEffect(() => {
    setResult(null);

    if (!submissionId) return;

    const handleMessage = (event: MessageEvent) => {
      let data: { type?: string; submission?: Submission };
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.type === "SUBMISSION_RESULT" && data.submission?.id === submissionId) {
        setResult(data.submission);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [submissionId]);

  return result;
}
