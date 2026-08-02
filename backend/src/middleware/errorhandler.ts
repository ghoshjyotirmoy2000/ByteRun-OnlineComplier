import { ApiError } from "../utils/ApiError";
import type { Request, Response, NextFunction } from "express";

export const errorhanlder = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal server error ",
  });
};
