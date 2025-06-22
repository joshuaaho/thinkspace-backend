import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import CreateMessage, { CreateMessageCommand } from "@application/useCases/messages/create";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import { z } from "zod";
import { ValidationError } from "@domain/errors";
import { InvalidRequestError, ResourceNotFoundError } from "@application/useCases/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class CreateMessageController {
  private createMessageUseCase: CreateMessage;

  constructor(@inject(CONSTANTS.CreateMessageUseCase) createMessageUseCase: CreateMessage) {
    this.createMessageUseCase = createMessageUseCase;
  }

  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        text: z.string(),
        recipientId: z.string(),
      } satisfies ToZodSchema<CreateMessageCommand>);

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.createMessageUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (result.isErr()) {
        if (result.error instanceof ValidationError || result.error instanceof InvalidRequestError) {
          return res.status(400).json({ error: result.error.message });
        }
        if (result.error instanceof ResourceNotFoundError) {
          return res.status(404).json({ error: result.error.message });
        }
      }

      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}

export default CreateMessageController;