import { api, type ApiResponse } from "../../lib/api";
import type { RunCodePayload } from "./types";

export const runCode = (payload: RunCodePayload) =>
  api
    .post<ApiResponse<string>>("/submission/run-code", payload)
    .then((res) => res.data.data);
