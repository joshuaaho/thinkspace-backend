import { Err, Ok, Result } from "ts-results-es";
import IUserRepository from "@domain/repositories/IUserRepository";
import { injectable, inject } from "inversify";
import { InvalidRequestError } from "@application/useCases/errors";
import IAuthService from "@application/services/IAuthService";
import CONSTANTS from "@containers/constants";

export interface RefreshCommand {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

@injectable()
class RefreshUseCase {
  public userRepo: IUserRepository;
  private authService: IAuthService;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
    @inject(CONSTANTS.AuthService) authService: IAuthService,
  ) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute(
    request: RefreshCommand,
  ): Promise<Result<RefreshResponse, InvalidRequestError>> {
    const someUser = await this.userRepo.findByRefreshToken(
      request.refreshToken,
    );

    if (someUser.isNone()) {
      return Err(
        new InvalidRequestError("Invalid refresh token. Please login again."),
      );
    }

    const user = someUser.value;

    const payloadOrError = this.authService.verifyRefreshToken(
      request.refreshToken,
    );

    if (payloadOrError.isErr()) {
      return payloadOrError;
    }

    const payload = payloadOrError.value;

    if (payload.userId !== user.id.value) {
      return Err(
        new InvalidRequestError("Invalid refresh token. Please login again."),
      );
    }

    const accessToken = this.authService.createAccessToken(user.id.value);

    return Ok({ accessToken });
  }
}

export default RefreshUseCase;
