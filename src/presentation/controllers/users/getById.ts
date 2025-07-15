import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import GetByIdUseCase, {
  GetUserByIdCommand,
} from "@application/useCases/users/getById";
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
    userId: z.string(),
  } satisfies ToZodSchema<GetUserByIdCommand>);

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
export class GetByIdController extends Controller {
  private getByIdUseCase: GetByIdUseCase;

  constructor(
    @inject(CONSTANTS.GetUserByIdUseCase) getByIdUseCase: GetByIdUseCase,
  ) {
    super();
    this.getByIdUseCase = getByIdUseCase;
  }

  @Get("{userId}")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid HTTP request")
  @Response<HTTPError>(404, "User not found")
  @SuccessResponse("200", "User Retrieved Successfully")
  async handleGetById(@Path() userId: string) {
    const data = await this.getByIdUseCase.execute({ userId });

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(200);
    return data.value;
  }
}
