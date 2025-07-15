import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import GetUnreadCount from "@application/useCases/notifications/getUnreadCount";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import {
  Controller,
  Get,
  Route,
  Response,
  SuccessResponse,
  Request,
  Security,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

@injectable()
@Tags("Notifications")
@Route("notifications")
@Security("bearerAuth")
export class GetUnreadCountController extends Controller {
  private getUnreadCountUseCase: GetUnreadCount;

  constructor(
    @inject(CONSTANTS.GetUnreadCountUseCase)
    getUnreadCount: GetUnreadCount,
  ) {
    super();
    this.getUnreadCountUseCase = getUnreadCount;
  }

  @Get("/unread-count")
  @Response<HTTPError>(401, "Unauthenticated")
  @SuccessResponse("200", "Unread Count Retrieved Successfully")
  async handleGetUnreadCount(@Request() req: AuthenticatedRequest) {
    const data = await this.getUnreadCountUseCase.execute(req.user);

    this.setStatus(200);
    return data;
  }
}
