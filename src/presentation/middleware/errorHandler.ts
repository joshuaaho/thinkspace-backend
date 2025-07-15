import {
  ConflictError,
  InvalidRequestError,
  ResourceNotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "@application/useCases/errors";
import {
  AlreadyLikedPostError,
  NotLikedCommentError,
  NotLikedPostError,
  AlreadyLikedCommentError,
  SelfLikedCommentError,
  SelfLikedPostError,
  ValidationError,
} from "@domain/errors";
import { Response, NextFunction } from "express";
import { ZodError } from "zod";

export type HTTPError = {
  error: string;
};

function errorHandler(
  err: unknown,
  req: any,
  res: Response,
  _next: NextFunction,
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

  if (err instanceof UnauthenticatedError) {
    return res.status(401).json({
      error: err.message,
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(403).json({
      error: err.message,
    });
  }

  if (err instanceof ResourceNotFoundError) {
    return res.status(404).json({
      error: err.message,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      error: err.message,
    });
  }

  if (err instanceof InvalidRequestError) {
    return res.status(400).json({
      error: err.message,
    });
  }

  if (
    err instanceof AlreadyLikedPostError ||
    err instanceof NotLikedPostError ||
    err instanceof AlreadyLikedCommentError ||
    err instanceof NotLikedCommentError ||
    err instanceof SelfLikedPostError ||
    err instanceof SelfLikedCommentError
  ) {
    return res.status(400).json({
      error: err.message,
    });
  }

  req.logger.error(err);
  res.status(500).json({
    error: "Internal Server Error",
  });
  setTimeout(() => {
    process.exit(1);
  }, 5000);
}

export default errorHandler;
