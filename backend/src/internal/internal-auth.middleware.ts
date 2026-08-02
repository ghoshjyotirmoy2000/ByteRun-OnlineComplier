import { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError";

export const authenticateInternalApi: RequestHandler = (
  req,
  res,
  next,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, "Authorization header is missing");
  }

  const [scheme, secret] = authHeader.split(" ");

  if (scheme !== "Bearer" || !secret) {
    throw new ApiError(401, "Invalid authorization format");
  }

  if (secret !== process.env.INTERNAL_API_TOKEN) {
    throw new ApiError(401, "Invalid internal API token");
  }

  next();
};