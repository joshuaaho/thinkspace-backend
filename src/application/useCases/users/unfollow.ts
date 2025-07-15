import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import User from "@domain/entities/User";
import { Result, Ok, Err } from "ts-results-es";
import {
  ResourceNotFoundError,
  InvalidRequestError,
} from "@application/useCases/errors";

export type UnfollowCommand = {
  userId: string;
};

@injectable()
class Unfollow {
  private userRepo: IUserRepository;

  constructor(@inject(CONSTANTS.UserRepository) userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  public async execute(
    command: UnfollowCommand,
    requestor: User,
  ): Promise<Result<void, ResourceNotFoundError | InvalidRequestError>> {
    const userToUnfollowOption = await this.userRepo.findById(command.userId);

    if (userToUnfollowOption.isNone()) {
      return Err(new ResourceNotFoundError("User to unfollow not found"));
    }

    const userToUnfollow = userToUnfollowOption.value;
    const result = userToUnfollow.removeFollower(requestor.id);

    if (result.isErr()) {
      return result;
    }

    await this.userRepo.save(userToUnfollow);
    return Ok.EMPTY;
  }
}

export default Unfollow;
