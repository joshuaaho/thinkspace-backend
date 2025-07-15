import { inject, injectable } from "inversify";
import DeleteComment, {
  DeleteCommentCommand,
} from "@application/useCases/comments/delete";
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
    commentId: z.string(),
  } satisfies ToZodSchema<DeleteCommentCommand>);

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
export class DeleteCommentController extends Controller {
  private deleteCommentUseCase: DeleteComment;

  constructor(
    @inject(CONSTANTS.DeleteCommentUseCase) deleteCommentUseCase: DeleteComment,
  ) {
    super();
    this.deleteCommentUseCase = deleteCommentUseCase;
  }

  @Delete("/{commentId}")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(403, "Unauthorized")
  @Response<HTTPError>(404, "Comment not found")
  @SuccessResponse("204", "Comment Deleted Successfully")
  async delete(
    @Path() commentId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.deleteCommentUseCase.execute(
      { commentId },
      req.user,
    );

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(204);
    return;
  }
}
