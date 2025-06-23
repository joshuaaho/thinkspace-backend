import { ValidationError } from "@domain/errors";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export type HTTPError = {
  message: string;
};

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  // HTTP layer errors e.g. bad body, bad query, etc.
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid HTTP request",
    });
  }

  // Domain layer validation errors e.g. Invalid email, etc.
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message,
    });
  }

  next();
}

export default errorHandler;
