import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import User, { ThemePreference } from "@domain/entities/User";

export type GetMeResponse = {
  id: string;
  username: string;
  email: string;
  work?: string;
  bio?: string;
  education?: string;
  interest?: string;
  location?: string;
  profileImgUrl: string;
  themePreference: ThemePreference;
  followedBy: string[];
};

@injectable()
class GetMe {
  private userRepo: IUserRepository;

  constructor(@inject(CONSTANTS.UserRepository) userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  public async execute(requestor: User): Promise<GetMeResponse> {
    const user = requestor;

    return {
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
    };
  }
}

export default GetMe;
