import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import QueryUsers, {
  QueryUsersCommand,
} from "@application/useCases/users/query";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import { z } from "zod";

@injectable()
export class QueryUsersController {
  private queryUsersUseCase: QueryUsers;

  constructor(
    @inject(CONSTANTS.QueryUsersUseCase) queryUsersUseCase: QueryUsers
  ) {
    this.queryUsersUseCase = queryUsersUseCase;
  }

  async queryUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        username: z.string().optional(),
        offset: z.coerce.number().optional(),
        limit: z.coerce.number().optional(),
      } satisfies ToZodSchema<QueryUsersCommand>);

      const validationResult = schema.safeParse(req.query);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const users = await this.queryUsersUseCase.execute(validationResult.data);

      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}

export default QueryUsersController;
