import { inject, injectable } from "inversify";
import DeletePost, {
  DeletePostCommand,
} from "@application/useCases/posts/delete";
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
  Delete,
  Route,
  Response,
  SuccessResponse,
  Path,
  Request,
  Security,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    postId: z.string(),
  } satisfies ToZodSchema<DeletePostCommand>);

  const validationResult = schema.safeParse({
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
export class DeletePostController extends Controller {
  private deletePostUseCase: DeletePost;

  constructor(
    @inject(CONSTANTS.DeletePostUseCase) deletePostUseCase: DeletePost,
  ) {
    super();
    this.deletePostUseCase = deletePostUseCase;
  }

  @Delete("/{postId}")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(403, "Unauthorized")
  @Response<HTTPError>(404, "Post not found")
  @SuccessResponse("204", "Post Deleted Successfully")
  async deletePost(
    @Path() postId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.deletePostUseCase.execute({ postId }, req.user);

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(200);
    return;
  }
}
