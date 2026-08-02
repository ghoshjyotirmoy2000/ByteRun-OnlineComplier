import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import type { JwtPayload } from "../utils/token";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    throw new ApiError(401, "Not authenticated");
  }

  try {
    req.user = jwt.verify(
      accessToken,
      process.env.JWT_PRIVATE_KEY!,
    ) as JwtPayload;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }
};
