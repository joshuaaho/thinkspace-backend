import { inject, injectable } from "inversify";
import LogoutUseCase, {
  LogoutCommand,
} from "@application/useCases/authentication/logout";
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
  SuccessResponse,
  Request,
  Tags,
} from "tsoa";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    refreshToken: z.string(),
  } satisfies ToZodSchema<LogoutCommand>);

  const validationResult = schema.safeParse({ refreshToken: req.cookies.jwt });

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Authentication")
@Route("auth")
export class LogoutController extends Controller {
  private logoutUseCase: LogoutUseCase;

  constructor(@inject(CONSTANTS.LogoutUseCase) logoutUseCase: LogoutUseCase) {
    super();
    this.logoutUseCase = logoutUseCase;
  }

  @Post("/logout")
  @Middlewares(customMiddleware)
  @SuccessResponse("200", "Logged out successfully")
  async logout(@Request() req: ExpressRequest) {
    await this.logoutUseCase.execute({
      refreshToken: req.cookies.jwt,
    });

    this.setStatus(200);
    this.setHeader(
      "Set-Cookie",
      `jwt=; HttpOnly; SameSite=Lax; Secure; Max-Age=0`,
    );

    return;
  }
}
