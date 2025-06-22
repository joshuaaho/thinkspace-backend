import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import DeletePost, { DeletePostCommand } from "@application/useCases/posts/delete";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { UnauthorizedError } from "@application/useCases/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class DeletePostController {
  private deletePostUseCase: DeletePost;

  constructor(@inject(CONSTANTS.DeletePostUseCase) deletePostUseCase: DeletePost) {
    this.deletePostUseCase = deletePostUseCase;
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        postId: z.string(),
      } satisfies ToZodSchema<DeletePostCommand>);

      const validationResult = schema.safeParse({
        postId: req.params.postId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.deletePostUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (result.isErr()) {
        if (result.error instanceof UnauthorizedError) {
          return res.status(403).json({ error: result.error.message });
        }
        if (result.error instanceof ResourceNotFoundError) {
          return res.status(404).json({ error: result.error.message });
        }
      }

      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}

export default DeletePostController;
