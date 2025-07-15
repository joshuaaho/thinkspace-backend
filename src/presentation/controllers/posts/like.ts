import { inject, injectable } from "inversify";
import LikePost, { LikePostCommand } from "@application/useCases/posts/like";
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
  } satisfies ToZodSchema<LikePostCommand>);

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
export class LikePostController extends Controller {
  private likePostUseCase: LikePost;

  constructor(@inject(CONSTANTS.LikePostUseCase) likePostUseCase: LikePost) {
    super();
    this.likePostUseCase = likePostUseCase;
  }

  @Post("/{postId}/like")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(404, "Post not found")
  @Response<HTTPError>(
    400,
    "Already liked or Self like or invalid HTTP request",
  )
  @SuccessResponse("201", "Post Liked Successfully")
  async likePost(@Path() postId: string, @Request() req: AuthenticatedRequest) {
    const data = await this.likePostUseCase.execute({ postId }, req.user);

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(201);
    return;
  }
}
