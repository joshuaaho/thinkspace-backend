import { inject, injectable } from "inversify";
import LikeComment, {
  LikeCommentCommand,
} from "@application/useCases/comments/like";
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
    commentId: z.string(),
  } satisfies ToZodSchema<LikeCommentCommand>);

  const validationResult = schema.safeParse({
    commentId: req.params.commentId,
  });

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Comments")
@Route("comments")
@Security("bearerAuth")
export class LikeCommentController extends Controller {
  private likeCommentUseCase: LikeComment;

  constructor(
    @inject(CONSTANTS.LikeCommentUseCase) likeCommentUseCase: LikeComment,
  ) {
    super();
    this.likeCommentUseCase = likeCommentUseCase;
  }

  @Post("/{commentId}/like")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(
    400,
    "Already liked or Self like or invalid HTTP request",
  )
  @Response<HTTPError>(400, "Invalid request or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(404, "Comment not found")
  @SuccessResponse("201", "Comment Liked Successfully")
  async like(@Path() commentId: string, @Request() req: AuthenticatedRequest) {
    const data = await this.likeCommentUseCase.execute({ commentId }, req.user);

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(201);
    return;
  }
}
