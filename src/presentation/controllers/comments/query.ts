import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import QueryComments, { QueryCommentsCommand } from "@application/useCases/comments/query";
import { z } from "zod";
import { ToZodSchema } from "@zod";

@injectable()
class QueryCommentsController {
  private queryCommentsUseCase: QueryComments;

  constructor(
    @inject(CONSTANTS.QueryCommentsUseCase) queryCommentsUseCase: QueryComments
  ) {
    this.queryCommentsUseCase = queryCommentsUseCase;
  }

  public async query(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        offset: z.coerce.number().optional(),
        limit: z.coerce.number().optional(),
        postId: z.string().optional(),
        authorId: z.string().optional(),
      } satisfies ToZodSchema<Partial<QueryCommentsCommand>>);

      const validationResult = schema.safeParse(req.query);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid query parameters" });
      }

      const result = await this.queryCommentsUseCase.execute(validationResult.data);
      return res.status(200).json(result.unwrap());
    } catch (error) {
      next(error);
    }
  }
}

export default QueryCommentsController;