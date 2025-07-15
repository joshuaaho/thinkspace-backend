import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
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
import GetChatListUseCase from "@application/useCases/messages/getChatList";
import { HTTPError } from "@presentation/middleware/errorHandler";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
@injectable()
@Tags("Messages")
@Route("chats")
@Security("bearerAuth")
export class GetChatListController extends Controller {
  private getChatListUseCase: GetChatListUseCase;

  constructor(
    @inject(CONSTANTS.GetChatListUseCase)
    getChatListUseCase: GetChatListUseCase,
  ) {
    super();
    this.getChatListUseCase = getChatListUseCase;
  }

  @Get()
  @Response<HTTPError>(401, "Unauthenticated")
  @SuccessResponse("200", "Chat List Retrieved Successfully")
  async getChatList(@Request() req: AuthenticatedRequest) {
    const data = await this.getChatListUseCase.execute(req.user);

    this.setStatus(200);
    return data;
  }
}
