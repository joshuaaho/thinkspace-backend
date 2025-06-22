import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import EditPost, { EditPostCommand } from "@application/useCases/posts/edit";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { ResourceNotFoundError, UnauthorizedError } from "@application/useCases/errors";
import { ValidationError } from "@domain/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class EditPostController {
  private editPostUseCase: EditPost;

constructor(@inject(CONSTANTS.EditPostUseCase) editPostUseCase: EditPost) {
    this.editPostUseCase = editPostUseCase;
  }

  async editPost(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        tags: z.array(z.string()).optional(),
        imgUrls: z.array(z.string().url()).optional(),
        postId: z.string(),
      } satisfies ToZodSchema<EditPostCommand>);

      const validationResult = schema.safeParse({
        ...req.body,
        postId: req.params.postId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.editPostUseCase.execute(
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

export default EditPostController;
