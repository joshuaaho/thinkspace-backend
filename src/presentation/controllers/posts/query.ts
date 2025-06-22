import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import QueryPosts, {
  QueryPostsCommand,
} from "@application/useCases/posts/query";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import { z } from "zod";

@injectable()
class QueryPostController {
  private queryPostsUseCase: QueryPosts;

  constructor(
      @inject(CONSTANTS.QueryPostsUseCase) queryPostsUseCase: QueryPosts
  ) {
    this.queryPostsUseCase = queryPostsUseCase;
  } 

  async queryPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        tags: z.array(z.string()).optional(),
        sortBy: z.enum(["newest", "oldest", "most-liked"]).optional(),
        offset: z.coerce.number().optional(),
        limit: z.coerce.number().optional(),
        title: z.string().optional(),
        authorId: z.string().optional(),
      } satisfies ToZodSchema<Partial<QueryPostsCommand>>);

      const validationResult = schema.safeParse(req.query);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.queryPostsUseCase.execute(
        validationResult.data
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default QueryPostController;
