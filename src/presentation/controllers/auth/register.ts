import { inject, injectable } from "inversify";
import Register from "@application/useCases/authentication/register";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import { z } from "zod";
import { RegisterCommand } from "@application/useCases/authentication/register";
import {
  Body,
  Controller,
  Middlewares,
  Post,
  Response,
  SuccessResponse,
  Route,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string(),
  } satisfies ToZodSchema<RegisterCommand>);

  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Authentication")
@Route("auth")
export class RegisterController extends Controller {
  private registerUseCase: Register;

  constructor(@inject(CONSTANTS.RegisterUseCase) registerUseCase: Register) {
    super();
    this.registerUseCase = registerUseCase;
  }

  @Post("/register")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Validation error or invalid HTTP request")
  @Response<HTTPError>(409, "Conflict error")
  @SuccessResponse("201", "Created")
  async register(@Body() body: RegisterCommand) {
    const data = await this.registerUseCase.execute(body);

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(201);
    return;
  }
}
