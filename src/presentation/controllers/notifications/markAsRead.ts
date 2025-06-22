import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import MarkAsRead, { MarkAsReadCommand } from "@application/useCases/notifications/markAsRead";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import { z } from "zod";
import { ToZodSchema } from "@zod";

@injectable()
class MarkAsReadController {
  private markAsRead: MarkAsRead;

  constructor(
    @inject(CONSTANTS.MarkAsReadUseCase)
    markAsRead: MarkAsRead
  ) {
    this.markAsRead = markAsRead;
  }

  public async handleMarkAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const schema = z.object({
        redirectToResourceType: z.string().optional(),
        resourceId: z.string().optional(),
      } satisfies ToZodSchema<MarkAsReadCommand>);

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const { requestor } = req as AuthenticatedRequest;
      await this.markAsRead.execute(validationResult.data, requestor);

      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}

export default MarkAsReadController;
