import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import QueryComments, {
  QueryCommentsCommand,
} from "@application/useCases/comments/query";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";

import {
  Controller,
  Middlewares,
  Get,
  Route,
  Response,
  SuccessResponse,
  Tags,
  Queries,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    postId: z.string().optional(),
    authorId: z.string().optional(),
    sortBy: z.enum(["newest", "oldest", "mostLiked"]).optional(),
  } satisfies ToZodSchema<Partial<QueryCommentsCommand>>);

  const validationResult = schema.safeParse(req.query);

  if (!validationResult.success) {
    return next(validationResult.error);
  }

  req.query = validationResult.data as any;
  return next();
}

@injectable()
@Tags("Comments")
@Route("comments")
export class QueryCommentsController extends Controller {
  private queryCommentsUseCase: QueryComments;

  constructor(
    @inject(CONSTANTS.QueryCommentsUseCase) queryCommentsUseCase: QueryComments,
  ) {
    super();
    this.queryCommentsUseCase = queryCommentsUseCase;
  }

  @Get()
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid HTTP request")
  @SuccessResponse("200", "Comments Retrieved Successfully")
  async query(@Queries() query: QueryCommentsCommand) {
    const data = await this.queryCommentsUseCase.execute(query);

    this.setStatus(200);
    return data.unwrap();
  }
}
