import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import UnlikeComment, { UnlikeCommentCommand } from "@application/useCases/comments/unlike";
import CONSTANTS from "@containers/constants";
import { z } from "zod";  
import { ToZodSchema } from "@zod";
import {
  ResourceNotFoundError,

} from "@application/useCases/errors";
import { NotLikedCommentError } from "@domain/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class UnlikeCommentController {
  private unlikeCommentUseCase: UnlikeComment;

    constructor(@inject(CONSTANTS.UnlikeCommentUseCase) unlikeCommentUseCase: UnlikeComment) {
    this.unlikeCommentUseCase = unlikeCommentUseCase;
  }

  async unlike(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        commentId: z.string(),
      } satisfies ToZodSchema<UnlikeCommentCommand>);

      const validationResult = schema.safeParse({
        commentId: req.params.commentId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.unlikeCommentUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (result.isErr()) {
        if (result.error instanceof ResourceNotFoundError) {
          return res.status(404).json({ error: result.error.message });
        }
        if (result.error instanceof NotLikedCommentError) {
          return res.status(400).json({ error: result.error.message });
        }
      }

      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}

export default UnlikeCommentController;
