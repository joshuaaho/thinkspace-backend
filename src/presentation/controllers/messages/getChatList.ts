import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import GetChatList from "@application/useCases/messages/getChatList";
import CONSTANTS from "@containers/constants";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class GetChatListController {
  private getChatListUseCase: GetChatList;

  constructor(
    @inject(CONSTANTS.GetChatListUseCase) getChatListUseCase: GetChatList
  ) {
    this.getChatListUseCase = getChatListUseCase;
  }

  async getChatList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getChatListUseCase.execute(
        (req as AuthenticatedRequest).requestor
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default GetChatListController;
