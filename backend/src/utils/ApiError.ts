export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
