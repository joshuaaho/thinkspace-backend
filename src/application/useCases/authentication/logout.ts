import IUserRepository from "@domain/repositories/IUserRepository";
import { injectable, inject } from "inversify";

import CONSTANTS from "@containers/constants";

export interface LogoutCommand {
  refreshToken: string;
}

@injectable()
class LogoutUseCase {
  public userRepo: IUserRepository;

  constructor(@inject(CONSTANTS.UserRepository) userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  public async execute(request: LogoutCommand) {
    const someUser = await this.userRepo.findByRefreshToken(
      request.refreshToken,
    );

    if (someUser.isNone()) {
      return;
    }

    const user = someUser.value;

    user.refreshToken = undefined;

    await this.userRepo.save(user);
    return;
  }
}

export default LogoutUseCase;
