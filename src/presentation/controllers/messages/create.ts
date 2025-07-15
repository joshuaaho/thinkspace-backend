import { inject, injectable } from "inversify";
import CreateMessage, {
  CreateMessageCommand,
} from "@application/useCases/messages/create";
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
  Post,
  Route,
  Response,
  SuccessResponse,
  Body,
  Request,
  Security,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
  const schema = z.object({
    text: z.string(),
    recipientId: z.string(),
  } satisfies ToZodSchema<CreateMessageCommand>);

  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Messages")
@Route("messages")
@Security("bearerAuth")
export class CreateMessageController extends Controller {
  private createMessageUseCase: CreateMessage;

  constructor(
    @inject(CONSTANTS.CreateMessageUseCase) createMessageUseCase: CreateMessage,
  ) {
    super();
    this.createMessageUseCase = createMessageUseCase;
  }

  @Post()
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Validation error or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @Response<HTTPError>(404, "Recipient not found")
  @SuccessResponse("200", "Message Created Successfully")
  async createMessage(
    @Body() body: CreateMessageCommand,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.createMessageUseCase.execute(body, req.user);

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(200);
    return;
  }
}
