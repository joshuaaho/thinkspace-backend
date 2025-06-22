import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import { Result, Ok, Err } from "ts-results-es";
import { ResourceNotFoundError } from "@application/useCases/errors";

export type GetByIdCommand = {
  userId: string;
};

export type GetByIdResponse = {
  id: string; 
  username: string;
  email: string;
  work?: string;
  bio?: string;
  education?: string;
  interest?: string;
  location?: string;
  profileImgUrl: string;
  themePreference: string;
  followedBy: string[];
};

@injectable()
class GetById {
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository
  ) {
    this.userRepo = userRepo;
  }

  public async execute(
    command: GetByIdCommand,
  ): Promise<Result<GetByIdResponse, ResourceNotFoundError>> {
    const someUser = await this.userRepo.findById(command.userId);

    if (someUser.isNone()) {
      return Err(new ResourceNotFoundError("User not found"));
    }

    const user = someUser.value;

    return Ok({
      id: user.id.value,
      username: user.username.value,
      email: user.email.value,
      work: user.work?.value,
      bio: user.bio?.value,
      education: user.education?.value,
      interest: user.interest?.value,
      location: user.location?.value,
      profileImgUrl: user.profileImgUrl.value,
      themePreference: user.themePreference,
      followedBy: user.followedBy.map((id) => id.value),
    });
  }
}

export default GetById; 