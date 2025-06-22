import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import GetUnreadCount from "@application/useCases/notifications/getUnreadCount";
import { AuthenticatedRequest } from "@presentation/middleware/auth";

@injectable()
class GetUnreadCountController {
  private getUnreadCountUseCase: GetUnreadCount;

  constructor(
    @inject(CONSTANTS.GetUnreadCountUseCase)
    getUnreadCount: GetUnreadCount
  ) {
    this.getUnreadCountUseCase = getUnreadCount;
  }

  public async handleGetUnreadCount(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { requestor } = req as AuthenticatedRequest;
    const result = await this.getUnreadCountUseCase.execute(requestor);
    return res.status(200).json(result);
  }
}

export default GetUnreadCountController; 