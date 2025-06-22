import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import User from "@domain/entities/User";
import { Result, Ok, Err } from "ts-results-es";
import { ResourceNotFoundError, InvalidRequestError } from "@application/useCases/errors";

export type FollowCommand = {
  userId: string;
};

@injectable()
class Follow {
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository
  ) {
    this.userRepo = userRepo;
  }

  public async execute(
    command: FollowCommand,
    requestor: User
  ): Promise<Result<void, ResourceNotFoundError | InvalidRequestError>> {
    const userToFollow = (await this.userRepo.findById(command.userId)).unwrap();
    const result = userToFollow.acceptFollowFromUser(requestor.id);
    
    if (result.isErr()) {
      return result;
    }

    await this.userRepo.save(userToFollow);
    return Ok.EMPTY;
  }
}

export default Follow; 