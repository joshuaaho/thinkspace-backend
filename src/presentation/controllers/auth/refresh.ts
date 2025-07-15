import { inject, injectable } from "inversify";
import RefreshUseCase, {
  RefreshCommand,
} from "@application/useCases/authentication/refresh";
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
  Post,
  Route,
  Response,
  SuccessResponse,
  Request,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    refreshToken: z.string(),
  } satisfies ToZodSchema<RefreshCommand>);

  const validationResult = schema.safeParse({
    refreshToken: req.cookies.jwt,
  });

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Authentication")
@Route("auth")
export class RefreshController extends Controller {
  private refreshUseCase: RefreshUseCase;

  constructor(
    @inject(CONSTANTS.RefreshUseCase) refreshUseCase: RefreshUseCase,
  ) {
    super();
    this.refreshUseCase = refreshUseCase;
  }

  @Post("/refresh")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid refresh token or invalid HTTP request")
  @SuccessResponse("201", "Created")
  async refresh(@Request() req: ExpressRequest) {
    const data = await this.refreshUseCase.execute({
      refreshToken: req.cookies.jwt,
    });

    if (data.isErr()) {
      throw data.error;
    }

    const { accessToken } = data.value;

    this.setStatus(201);
    return { accessToken };
  }
}
