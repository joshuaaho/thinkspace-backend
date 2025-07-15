import { inject, injectable } from "inversify";
import EditComment, {
  EditCommentCommand,
} from "@application/useCases/comments/edit";
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
  Body,
  Request,
  Security,
  Patch,
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
    content: z.string(),
  } satisfies ToZodSchema<EditCommentCommand>);

  const validationResult = schema.safeParse({
    commentId: req.params.commentId,
    content: req.body.content,
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
export class EditCommentController extends Controller {
  private editCommentUseCase: EditComment;

  constructor(
    @inject(CONSTANTS.EditCommentUseCase) editCommentUseCase: EditComment,
  ) {
    super();
    this.editCommentUseCase = editCommentUseCase;
  }

  @Patch("/{commentId}")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Validation error or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(403, "Unauthorized")
  @Response<HTTPError>(404, "Comment not found")
  @SuccessResponse("200", "Comment Edited Successfully")
  async edit(
    @Path() commentId: string,
    @Body() body: EditCommentBody,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.editCommentUseCase.execute(
      { ...body, commentId },
      req.user,
    );

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(200);
    return;
  }
}

interface EditCommentBody {
  content: string;
}
