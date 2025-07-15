import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import Follow, { FollowCommand } from "@application/useCases/users/follow";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";
import {
  Controller,
  Post,
  Route,
  Response,
  SuccessResponse,
  Security,
  Request,
  Path,
  Middlewares,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    userId: z.string().min(1, "User ID is required"),
  } satisfies ToZodSchema<FollowCommand>);

  const validationResult = schema.safeParse({
    userId: req.params.userId,
  });

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Users")
@Route("users")
export class FollowController extends Controller {
  private followUseCase: Follow;

  constructor(@inject(CONSTANTS.FollowUserUseCase) followUseCase: Follow) {
    super();
    this.followUseCase = followUseCase;
  }

  @Post("/{userId}/follow")
  @Security("bearerAuth")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid Request or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(404, "User Not Found")
  @SuccessResponse("201", "Successfully followed user")
  async follow(@Path() userId: string, @Request() req: AuthenticatedRequest) {
    const result = await this.followUseCase.execute({ userId }, req.user);

    if (result.isErr()) {
      throw result.error;
    }

    this.setStatus(201);
    return;
  }
}
