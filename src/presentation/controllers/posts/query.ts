import { inject, injectable } from "inversify";
import QueryPosts, {
  QueryPostsCommand,
} from "@application/useCases/posts/query";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import { z } from "zod";
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
  Queries,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    tags: z.array(z.string()).optional(),
    sortBy: z.enum(["newest", "oldest", "mostLiked"]).optional(),
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    title: z.string().optional(),
    authorId: z.string().optional(),
  } satisfies ToZodSchema<Partial<QueryPostsCommand>>);

  const validationResult = schema.safeParse(req.query);

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  req.query = validationResult.data as any;
  return next();
}

@injectable()
@Tags("Posts")
@Route("posts")
export class QueryPostController extends Controller {
  private queryPostsUseCase: QueryPosts;

  constructor(
    @inject(CONSTANTS.QueryPostsUseCase) queryPostsUseCase: QueryPosts,
  ) {
    super();
    this.queryPostsUseCase = queryPostsUseCase;
  }

  @Get()
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid HTTP request")
  @SuccessResponse("200", "Posts Retrieved Successfully")
  async queryPosts(@Queries() query: QueryPostsCommand) {
    const data = await this.queryPostsUseCase.execute(query);

    this.setStatus(200);
    return data;
  }
}
