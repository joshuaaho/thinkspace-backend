import {  GetPostByIdCommand} from "@application/useCases/posts/getById";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import GetPostByIdUseCase from "@application/useCases/posts/getById";
import { ToZodSchema } from "@zod";
import z from "zod";
import { NextFunction } from "express";
import { Request, Response } from "express";

@injectable()
class GetPostByIdController {
  private getPostByIdUseCase: GetPostByIdUseCase;

  constructor(  
    @inject(CONSTANTS.GetPostByIdUseCase) getPostByIdUseCase: GetPostByIdUseCase
  ) {
    this.getPostByIdUseCase = getPostByIdUseCase;
  }

  public async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
    const schema = z.object({
      postId: z.string(),
    } satisfies ToZodSchema<GetPostByIdCommand>);

    const validationResult = schema.safeParse({
      postId: req.params.postId,
    });

    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid HTTP request" });
    }

    const useCaseResult = await this.getPostByIdUseCase.execute(validationResult.data);

    if (useCaseResult.isErr()) {
      return res.status(404).json({ error: useCaseResult.error.message });
    }

      return res.status(200).json(useCaseResult.unwrap());
    } catch (error) {
      next(error);
    }
  }
}

export default GetPostByIdController;
