import { inject, injectable } from "inversify";
import QueryUsers, {
  QueryUsersCommand,
} from "@application/useCases/users/query";
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
  Get,
  Route,
  SuccessResponse,
  Queries,
  Tags,
  Response,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    username: z.string().optional(),
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  } satisfies ToZodSchema<QueryUsersCommand>);

  const validationResult = schema.safeParse(req.query);

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  req.query = validationResult.data as any;
  return next();
}

@injectable()
@Tags("Users")
@Route("users")
export class QueryUsersController extends Controller {
  private queryUsersUseCase: QueryUsers;

  constructor(
    @inject(CONSTANTS.QueryUsersUseCase) queryUsersUseCase: QueryUsers,
  ) {
    super();
    this.queryUsersUseCase = queryUsersUseCase;
  }

  @Get()
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid HTTP request")
  @SuccessResponse("200", "Users Retrieved Successfully")
  async queryUsers(@Queries() query: QueryUsersCommand) {
    const data = await this.queryUsersUseCase.execute(query);

    this.setStatus(200);
    return data;
  }
}
