import type { NextFunction, Request, RequestHandler, Response } from "express";
import { type ZodObject } from "zod";
import { ApiError } from "../utils/ApiError";

export const validateRequest = (schema: ZodObject): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        result.error.issues.map((issue) => issue.message).join(", "),
      );
    }

    req.body = result.data;
    next();
  };
};
