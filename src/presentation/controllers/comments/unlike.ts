import { inject, injectable } from "inversify";
import UnlikeComment, {
  UnlikeCommentCommand,
} from "@application/useCases/comments/unlike";
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
  Route,
  Response,
  SuccessResponse,
  Path,
  Request,
  Security,
  Post,
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
  } satisfies ToZodSchema<UnlikeCommentCommand>);

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
export class UnlikeCommentController extends Controller {
  private unlikeCommentUseCase: UnlikeComment;

  constructor(
    @inject(CONSTANTS.UnlikeCommentUseCase) unlikeCommentUseCase: UnlikeComment,
  ) {
    super();
    this.unlikeCommentUseCase = unlikeCommentUseCase;
  }

  @Post("/{commentId}/unlike")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid request or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(404, "Comment not found")
  @SuccessResponse("200", "Comment Unliked Successfully")
  async unlike(
    @Path() commentId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.unlikeCommentUseCase.execute(
      { commentId },
      req.user,
    );

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(200);
    return;
  }
}
