import { inject, injectable } from "inversify";
import CreateComment, {
  CreateCommentCommand,
} from "@application/useCases/comments/create";
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
  Body,
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
    content: z.string(),
    postId: z.string(),
    parentCommentId: z.string().optional(),
  } satisfies ToZodSchema<CreateCommentCommand>);

  const validationResult = schema.safeParse(req.body);
  if (!validationResult.success) {
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Comments")
@Route("comments")
@Security("bearerAuth")
export class CreateCommentController extends Controller {
  private createCommentUseCase: CreateComment;

  constructor(
    @inject(CONSTANTS.CreateCommentUseCase) createCommentUseCase: CreateComment,
  ) {
    super();
    this.createCommentUseCase = createCommentUseCase;
  }

  @Post()
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Validation error or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(404, "Corresponding post or parent comment not found")
  @SuccessResponse("201", "Comment Created Successfully")
  async create(
    @Body() body: CreateCommentCommand,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.createCommentUseCase.execute(body, req.user);

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(201);
    return { message: "Comment created successfully" };
  }
}
