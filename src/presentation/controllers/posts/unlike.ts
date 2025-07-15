import { inject, injectable } from "inversify";
import UnlikePost, {
  UnlikePostCommand,
} from "@application/useCases/posts/unlike";
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
  Post,
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
  } satisfies ToZodSchema<UnlikePostCommand>);

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
export class UnlikePostController extends Controller {
  private unlikePostUseCase: UnlikePost;

  constructor(
    @inject(CONSTANTS.UnlikePostUseCase) unlikePostUseCase: UnlikePost,
  ) {
    super();
    this.unlikePostUseCase = unlikePostUseCase;
  }

  @Post("/{postId}/unlike")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid request or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(404, "Post not found")
  @SuccessResponse("200", "Post Unliked Successfully")
  async unlikePost(
    @Path() postId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.unlikePostUseCase.execute({ postId }, req.user);

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(200);
    return;
  }
}
