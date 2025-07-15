import { inject, injectable } from "inversify";
import Login, {
  LoginCommand,
} from "@application/useCases/authentication/login";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";
import {
  Body,
  Controller,
  Middlewares,
  Post,
  Route,
  Response,
  SuccessResponse,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    username: z.string(),
    password: z.string(),
  } satisfies ToZodSchema<LoginCommand>);

  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  next();
}
@injectable()
@Tags("Authentication")
@Route("auth")
export class LoginController extends Controller {
  private loginUseCase: Login;
  constructor(@inject(CONSTANTS.LoginUseCase) loginUseCase: Login) {
    super();
    this.loginUseCase = loginUseCase;
  }

  @Post("/login")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "invalid HTTP request")
  @Response<HTTPError>(401, "Login Unsuccessful")
  @SuccessResponse("201", "Created")
  async login(@Body() body: LoginCommand) {
    const data = await this.loginUseCase.execute(body);

    if (data.isErr()) {
      throw data.error;
    }

    const { accessToken, refreshToken } = data.value;

    this.setStatus(200);
    this.setHeader(
      "Set-Cookie",
      `jwt=${refreshToken}; HttpOnly; SameSite=None; Secure; Max-Age=24*60*60*1000`,
    );

    return { accessToken };
  }
}
