import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";

import Unfollow, {
  UnfollowCommand,
} from "@application/useCases/users/unfollow";
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
  } satisfies ToZodSchema<UnfollowCommand>);

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
export class UnfollowController extends Controller {
  private unfollowUseCase: Unfollow;

  constructor(
    @inject(CONSTANTS.UnfollowUserUseCase) unfollowUseCase: Unfollow,
  ) {
    super();
    this.unfollowUseCase = unfollowUseCase;
  }

  @Post("/{userId}/unfollow")
  @Security("bearerAuth")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid Request")
  @Response<HTTPError>(404, "User Not Found")
  @SuccessResponse("200", "Successfully unfollowed user")
  async unfollow(@Path() userId: string, @Request() req: AuthenticatedRequest) {
    const result = await this.unfollowUseCase.execute({ userId }, req.user);

    if (result.isErr()) {
      throw result.error;
    }

    this.setStatus(200);
  }
}
