import { Err, Ok, Result } from "ts-results-es";

import IUserRepository from "@domain/repositories/IUserRepository";
import { injectable, inject } from "inversify";

import { UnauthenticatedError } from "@application/useCases/errors";

import IAuthService from "@application/services/IAuthService";
import CONSTANTS from "@containers/constants";

export interface LoginCommand {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
@injectable()
class LoginUseCase {
  public userRepo: IUserRepository;
  private authService: IAuthService;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
    @inject(CONSTANTS.AuthService) authService: IAuthService
  ) { 
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute(
    request: LoginCommand
  ): Promise<Result<LoginResponse, UnauthenticatedError>> {
   
    const someUser = await this.userRepo.findByUsername(request.username);

    if (someUser.isNone()) {
      return Err(new UnauthenticatedError("Invalid username or password"));
    }

    const user = someUser.value;

    const someErr = await user.password.verify(request.password);
    if (someErr.isErr()) {
      return someErr;
    }
    const accessToken = this.authService.createAccessToken(user.id.value);

    const refreshToken = this.authService.createRefreshToken(user.id.value);

    user.refreshToken = refreshToken;

    await this.userRepo.save(user);
    return Ok({ accessToken, refreshToken });
  }
}

export default LoginUseCase;
