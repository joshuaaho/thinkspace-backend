import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import GetById, { GetByIdCommand } from "@application/useCases/users/getById";

@injectable()
class GetByIdController {
  private getByIdUseCase: GetById;

  constructor(
    @inject(CONSTANTS.GetUserByIdUseCase) getByIdUseCase: GetById
  ) {
    this.getByIdUseCase = getByIdUseCase;
  }

  async handleGetById(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        userId: z.string(),
      } satisfies ToZodSchema<GetByIdCommand>);

      const validationResult = schema.safeParse({
        userId: req.params.userId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.getByIdUseCase.execute(
        validationResult.data,
      );

      if (result.isErr()) {

          return res.status(404).json({ error: result.error.message });
   
      
      }

      return res.status(200).json(result.unwrap());
    } catch (error) {
      next(error);
    }
  }
}

export default GetByIdController; 