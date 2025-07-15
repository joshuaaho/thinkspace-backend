import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import GetMe from "@application/useCases/users/getMe";
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
@Tags("Users")
@Route("me")
@Security("bearerAuth")
export class GetMeController extends Controller {
  private getMeUseCase: GetMe;

  constructor(@inject(CONSTANTS.GetMeUseCase) getMeUseCase: GetMe) {
    super();
    this.getMeUseCase = getMeUseCase;
  }

  @Get()
  @Response<HTTPError>(401, "Unauthenticated")
  @SuccessResponse("200", "User Retrieved Successfully")
  async handleGetMe(@Request() req: AuthenticatedRequest) {
    const data = await this.getMeUseCase.execute(req.user);

    this.setStatus(200);
    return data;
  }
}
