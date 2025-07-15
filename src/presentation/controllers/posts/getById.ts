import { GetPostByIdCommand } from "@application/useCases/posts/getById";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import GetPostByIdUseCase from "@application/useCases/posts/getById";
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
  Path,
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
  } satisfies ToZodSchema<GetPostByIdCommand>);

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
export class GetPostByIdController extends Controller {
  private getPostByIdUseCase: GetPostByIdUseCase;

  constructor(
    @inject(CONSTANTS.GetPostByIdUseCase)
    getPostByIdUseCase: GetPostByIdUseCase,
  ) {
    super();
    this.getPostByIdUseCase = getPostByIdUseCase;
  }

  @Get("/{postId}")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(404, "Post not found")
  @SuccessResponse("200", "Post Retrieved Successfully")
  async getPostById(@Path() postId: string) {
    const data = await this.getPostByIdUseCase.execute({ postId });

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(200);
    return data.value;
  }
}
