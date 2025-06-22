import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import CreateComment, {
  CreateCommentCommand,
} from "@application/useCases/comments/create";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import {
  ResourceNotFoundError,
  InvalidRequestError,
} from "@application/useCases/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import { ValidationError } from "@domain/errors";

@injectable()
class CreateCommentController {
  private createCommentUseCase: CreateComment;

  constructor(
    @inject(CONSTANTS.CreateCommentUseCase) createCommentUseCase: CreateComment
  ) {
    this.createCommentUseCase = createCommentUseCase;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        content: z.string(),
        postId: z.string(),
        parentCommentId: z.string().optional(),
      } satisfies ToZodSchema<CreateCommentCommand>);

      const validationResult = schema.safeParse({
        ...req.body,
      });
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const useCaseResult = await this.createCommentUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (useCaseResult.isErr()) {
        if (useCaseResult.error instanceof ResourceNotFoundError) {
          return res.status(404).json({ error: useCaseResult.error.message });
        }

        if (
          useCaseResult.error instanceof ValidationError ||
          useCaseResult.error instanceof InvalidRequestError
        ) {
          return res.status(400).json({ error: useCaseResult.error.message });
        }
      }

      return res.status(201).json({ message: "Comment created successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default CreateCommentController;
