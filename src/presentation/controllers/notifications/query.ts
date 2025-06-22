import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import QueryNotifications, { QueryNotificationsCommand } from "@application/useCases/notifications/query";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class QueryNotificationsController {
  private queryNotifications: QueryNotifications;

  constructor(
    @inject(CONSTANTS.QueryNotificationsUseCase)
    queryNotifications: QueryNotifications
  ) {
    this.queryNotifications = queryNotifications;
  }

  public async handleQuery(
    req: Request,
    res: Response
  ): Promise<Response> {
    const schema = z.object({
      offset: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),

    } satisfies ToZodSchema<QueryNotificationsCommand>);

    const validationResult = schema.safeParse(req.query);

    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid HTTP request" });
    }

    const { requestor } = req as AuthenticatedRequest;
    const result = await this.queryNotifications.execute(
      validationResult.data,
      requestor
    );

    return res.status(200).json(result);
  }
}

export default QueryNotificationsController;
