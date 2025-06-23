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

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
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
class CreatePostController extends Controller {
  private createPostUseCase: CreatePostUseCase;

  constructor(
    @inject(CONSTANTS.CreatePostUseCase) createPostUseCase: CreatePostUseCase
  ) {
    super();
    this.createPostUseCase = createPostUseCase;
  }
  @Middlewares(customMiddleware)
  @Response<HTTPError>(422, "Validation Failed")
  @SuccessResponse("201", "Created") // Custom success response
  async createPost(@Request() req: any, @Body() body: CreatePostCommand) {
    const result = await this.createPostUseCase.execute(body, req.user);

    if (result.isErr()) {
      throw result.error;
    }

    return result.unwrap();
  }
}

export default CreatePostController;
