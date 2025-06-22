import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import EditComment, { EditCommentCommand } from "@application/useCases/comments/edit";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import {
  ResourceNotFoundError,
  UnauthorizedError,
} from "@application/useCases/errors";
import { ValidationError } from "@domain/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class EditCommentController {
  private editCommentUseCase: EditComment;

  constructor(@inject(CONSTANTS.EditCommentUseCase) editCommentUseCase: EditComment) {
    this.editCommentUseCase = editCommentUseCase;
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        commentId: z.string(),
        content: z.string(),
      } satisfies ToZodSchema<EditCommentCommand>);

      const validationResult = schema.safeParse({
        commentId: req.params.commentId,
        content: req.body.content,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.editCommentUseCase.execute(
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
        if (result.error instanceof ValidationError) {
          return res.status(400).json({ error: result.error.message });
        }
      }

      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}

export default EditCommentController;
