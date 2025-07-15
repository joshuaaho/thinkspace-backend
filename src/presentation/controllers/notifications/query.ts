import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import QueryNotificationsUseCase, {
  QueryNotificationsCommand,
} from "@application/useCases/notifications/query";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
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
  Request,
  Security,
  Tags,
  Queries,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  } satisfies ToZodSchema<QueryNotificationsCommand>);

  const validationResult = schema.safeParse(req.query);

  if (!validationResult.success) {
    return next(validationResult.error);
  }

  req.query = validationResult.data as any;
  return next();
}

@injectable()
@Tags("Notifications")
@Route("notifications")
@Security("bearerAuth")
export class QueryNotificationsController extends Controller {
  private queryNotifications: QueryNotificationsUseCase;

  constructor(
    @inject(CONSTANTS.QueryNotificationsUseCase)
    queryNotifications: QueryNotificationsUseCase,
  ) {
    super();
    this.queryNotifications = queryNotifications;
  }

  @Get("/me")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @SuccessResponse("200", "Notifications Retrieved Successfully")
  async handleQuery(
    @Request() req: AuthenticatedRequest,
    @Queries() query: QueryNotificationsCommand,
  ) {
    const data = await this.queryNotifications.execute(query, req.user);

    this.setStatus(200);
    return data;
  }
}
