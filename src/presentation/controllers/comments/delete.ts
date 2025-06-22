import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import DeleteComment, { DeleteCommentCommand } from "@application/useCases/comments/delete";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import {
  ResourceNotFoundError,
  UnauthorizedError,
} from "@application/useCases/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class DeleteCommentController {
  private deleteCommentUseCase: DeleteComment;

  constructor(@inject(CONSTANTS.DeleteCommentUseCase) deleteCommentUseCase: DeleteComment) {
    this.deleteCommentUseCase = deleteCommentUseCase;
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        commentId: z.string(),
      } satisfies ToZodSchema<DeleteCommentCommand>);

      const validationResult = schema.safeParse({
        commentId: req.params.commentId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.deleteCommentUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (result.isErr()) {
        if (result.error instanceof ResourceNotFoundError) {
          return res.status(404).json({ error: result.error.message });
        }
        if (result.error instanceof UnauthorizedError) {
          return res.status(403).json({ error: result.error.message });
        }
      }

      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
}

export default DeleteCommentController;
