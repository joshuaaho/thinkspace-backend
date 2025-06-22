import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import CreatePost, { CreatePostCommand } from "@application/useCases/posts/create";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { ValidationError } from "@domain/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class CreatePostController {
  private createPostUseCase: CreatePost;

  constructor(@inject(CONSTANTS.CreatePostUseCase) createPostUseCase: CreatePost) {
    this.createPostUseCase = createPostUseCase;
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        title: z.string(),
        content: z.string(),
        tags: z.array(z.string()).optional(),
        imgUrls: z.array(z.string()).optional(),
      } satisfies ToZodSchema<CreatePostCommand>);

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.createPostUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (result.isErr()) {
        if (result.error instanceof ValidationError) {
          return res.status(400).json({ error: result.error.message });
        }
      }

      return res.status(201).json(result.unwrap());
    } catch (error) {
      next(error);
    }
  }
}

export default CreatePostController;
