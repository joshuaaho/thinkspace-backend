import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import GetMe from "@application/useCases/users/getMe";

@injectable()
class GetMeController {
  private getMeUseCase: GetMe;

  constructor(
    @inject(CONSTANTS.GetMeUseCase) getMeUseCase: GetMe
  ) {
    this.getMeUseCase = getMeUseCase;
  }

  async handleGetMe(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getMeUseCase.execute(
        (req as AuthenticatedRequest).requestor
      );



      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default GetMeController; 