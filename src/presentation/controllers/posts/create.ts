import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import {
  Body,
  Request,
  Controller,
  Middlewares,
  SuccessResponse,
  Response,
  Security,
  Route,
  Post,
  Tags,
} from "tsoa";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";
import CreatePostUseCase, {
  CreatePostCommand,
} from "@application/useCases/posts/create";
import { HTTPError } from "@presentation/middleware/errorHandler";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()).optional(),
    imgUrls: z.array(z.string()).optional(),
  } satisfies ToZodSchema<CreatePostCommand>);

  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    throw validationResult.error;
  }
  next();
}

@injectable()
@Tags("Posts")
@Route("posts")
@Security("bearerAuth")
export class CreatePostController extends Controller {
  private createPostUseCase: CreatePostUseCase;

  constructor(
    @inject(CONSTANTS.CreatePostUseCase) createPostUseCase: CreatePostUseCase,
  ) {
    super();
    this.createPostUseCase = createPostUseCase;
  }

  @Post()
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Validation error or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @SuccessResponse("201", "Created")
  async createPost(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreatePostCommand,
  ) {
    const result = await this.createPostUseCase.execute(body, req.user);

    if (result.isErr()) {
      throw result.error;
    }

    return result.unwrap();
  }
}
