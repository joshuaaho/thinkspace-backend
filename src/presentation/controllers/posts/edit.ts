import { inject, injectable } from "inversify";
import EditPost, { EditPostCommand } from "@application/useCases/posts/edit";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";

import { AuthenticatedRequest } from "@presentation/middleware/auth";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";
import {
  Controller,
  Middlewares,
  Patch,
  Route,
  Response,
  SuccessResponse,
  Path,
  Request,
  Security,
  Body,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
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
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Posts")
@Route("posts")
@Security("bearerAuth")
export class EditPostController extends Controller {
  private editPostUseCase: EditPost;

  constructor(@inject(CONSTANTS.EditPostUseCase) editPostUseCase: EditPost) {
    super();
    this.editPostUseCase = editPostUseCase;
  }

  @Patch("/{postId}")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Validation error or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(403, "Unauthorized")
  @Response<HTTPError>(404, "Post not found")
  @SuccessResponse("200", "Post Edited Successfully")
  async editPost(
    @Path() postId: string,
    @Body() updates: EditPostUpdates,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.editPostUseCase.execute(
      { ...updates, postId },
      req.user,
    );

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(200);
    return;
  }
}

interface EditPostUpdates {
  title?: string;
  content?: string;
  tags?: string[];
  imgUrls?: string[];
}
