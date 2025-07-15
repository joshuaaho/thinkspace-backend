import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import MarkAsRead, {
  MarkAsReadCommand,
} from "@application/useCases/notifications/markAsRead";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import { z } from "zod";
import { ToZodSchema } from "@zod";
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
    redirectToResourceType: z.string().optional(),
    resourceId: z.string().optional(),
  } satisfies ToZodSchema<MarkAsReadCommand>);

  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Notifications")
@Route("notifications")
@Security("bearerAuth")
export class MarkAsReadController extends Controller {
  private markAsRead: MarkAsRead;

  constructor(
    @inject(CONSTANTS.MarkAsReadUseCase)
    markAsRead: MarkAsRead,
  ) {
    super();
    this.markAsRead = markAsRead;
  }

  @Post("/read")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @SuccessResponse("200", "Notifications Marked as Read Successfully")
  async handleMarkAsRead(
    @Body() body: MarkAsReadCommand,
    @Request() req: AuthenticatedRequest,
  ) {
    await this.markAsRead.execute(body, req.user);

    this.setStatus(200);
    return;
  }
}
