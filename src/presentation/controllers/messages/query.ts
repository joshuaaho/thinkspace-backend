import { inject, injectable } from "inversify";
import QueryMessages, {
  QueryMessagesCommand,
} from "@application/useCases/messages/query";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import { z } from "zod";
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
  Queries,
  Tags,
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
    otherParticipantId: z.string(),
  } satisfies ToZodSchema<QueryMessagesCommand>);

  const validationResult = schema.safeParse(req.query);

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  req.query = validationResult.data as any;
  return next();
}

@injectable()
@Tags("Messages")
@Route("messages")
@Security("bearerAuth")
export class QueryMessagesController extends Controller {
  private queryMessagesUseCase: QueryMessages;

  constructor(
    @inject(CONSTANTS.QueryMessagesUseCase) queryMessagesUseCase: QueryMessages,
  ) {
    super();
    this.queryMessagesUseCase = queryMessagesUseCase;
  }

  @Get()
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @SuccessResponse("200", "Messages Retrieved Successfully")
  async queryMessages(
    @Queries() query: QueryMessagesCommand,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.queryMessagesUseCase.execute(query, req.user);

    this.setStatus(200);
    return data;
  }
}
