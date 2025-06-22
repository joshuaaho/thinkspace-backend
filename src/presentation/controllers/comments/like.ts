import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import LikeComment, { LikeCommentCommand } from "@application/useCases/comments/like";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import {
  ResourceNotFoundError,

} from "@application/useCases/errors";
import { AlreadyLikedCommentError, SelfLikedCommentError } from "@domain/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable() 
class LikeCommentController {
  private likeCommentUseCase: LikeComment;

  constructor(@inject(CONSTANTS.LikeCommentUseCase) likeCommentUseCase: LikeComment) {
    this.likeCommentUseCase = likeCommentUseCase;
  }

  async like(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        commentId: z.string(),
      } satisfies ToZodSchema<LikeCommentCommand>);

      const validationResult = schema.safeParse({
        commentId: req.params.commentId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.likeCommentUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (result.isErr()) {
        if (result.error instanceof ResourceNotFoundError) {
          return res.status(404).json({ error: result.error.message });
        }
        if (result.error instanceof AlreadyLikedCommentError) {
          return res.status(400).json({ error: result.error.message });
        }
        if (result.error instanceof SelfLikedCommentError) {
          return res.status(400).json({ error: result.error.message });
        }
      }

      return res.status(201).json();
    } catch (error) {
      next(error);
    }
  }
}

export default LikeCommentController;
