import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import UnlikePost, { UnlikePostCommand } from "@application/useCases/posts/unlike";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { NotLikedPostError } from "@domain/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class UnlikePostController {
  private unlikePostUseCase: UnlikePost;

  constructor(@inject(CONSTANTS.UnlikePostUseCase) unlikePostUseCase: UnlikePost) {
    this.unlikePostUseCase = unlikePostUseCase;
  }

  async unlikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        postId: z.string(),
      } satisfies ToZodSchema<UnlikePostCommand>);

      const validationResult = schema.safeParse({
        postId: req.params.postId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.unlikePostUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (result.isErr()) {
        if (result.error instanceof ResourceNotFoundError) {
          return res.status(404).json({ error: result.error.message });
        }
        if (result.error instanceof NotLikedPostError) {
          return res.status(400).json({ error: result.error.message });
        }
      }

      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}

export default UnlikePostController;