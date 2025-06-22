import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import QueryMessages, { QueryMessagesCommand } from "@application/useCases/messages/query";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import { z } from "zod";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class QueryMessagesController {
  private queryMessagesUseCase: QueryMessages;

  constructor(@inject(CONSTANTS.QueryMessagesUseCase) queryMessagesUseCase: QueryMessages) {
    this.queryMessagesUseCase = queryMessagesUseCase;
  }

  async queryMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        offset: z.coerce.number().optional(),
        limit: z.coerce.number().optional(),
        otherParticipantId: z.string(),
      } satisfies ToZodSchema<QueryMessagesCommand>);

      const validationResult = schema.safeParse(req.query);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.queryMessagesUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default QueryMessagesController; 