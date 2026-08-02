import { api, type ApiResponse } from "../../lib/api";
import type { LoginPayload, RegisterPayload, User } from "./types";

export const loginUser = (payload: LoginPayload) =>
  api
    .post<ApiResponse<User>>("/auth/login", payload)
    .then((res) => res.data.data);

export const registerUser = (payload: RegisterPayload) =>
  api
    .post<ApiResponse<{ id: string }>>("/auth/register", payload)
    .then((res) => res.data.data);

export const fetchMe = () =>
  api.get<ApiResponse<User>>("/auth/me").then((res) => res.data.data);

export const logoutUser = () =>
  api.post<ApiResponse<null>>("/auth/logout").then((res) => res.data.data);
