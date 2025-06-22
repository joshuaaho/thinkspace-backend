import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import LikePost, { LikePostCommand } from "@application/useCases/posts/like";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { AlreadyLikedPostError, SelfLikedPostError } from "@domain/errors";

@injectable()
class LikePostController {
  private likePostUseCase: LikePost;

  constructor(@inject(CONSTANTS.LikePostUseCase) likePostUseCase: LikePost) {
    this.likePostUseCase = likePostUseCase;
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        postId: z.string(),
      } satisfies ToZodSchema<LikePostCommand>);

      const validationResult = schema.safeParse({
        postId: req.params.postId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.likePostUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (result.isErr()) {
        if (result.error instanceof ResourceNotFoundError) {
          return res.status(404).json({ error: result.error.message });
        }
        if (result.error instanceof AlreadyLikedPostError) {
          return res.status(400).json({ error: result.error.message });
        }
        if (result.error instanceof SelfLikedPostError) {
          return res.status(400).json({ error: result.error.message });
        }
      }

      return res.status(201).json();
    } catch (error) {
      next(error);
    }
  }
}

export default LikePostController;
