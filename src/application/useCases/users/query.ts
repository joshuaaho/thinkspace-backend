import { inject, injectable } from "inversify";
import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";
import { ThemePreference } from "@domain/entities/User";

export type QueryUsersCommand = Partial<{
  offset: number;
  limit: number;
  username: string;
}>;

export type QueryUsersResponse = {
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
}[];

@injectable()
class QueryUsersUseCase {
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository
  ) {
    this.userRepo = userRepo;
  }

  public async execute({
    username,
    offset,
    limit,
  }: QueryUsersCommand): Promise<QueryUsersResponse> {
    const users = await this.userRepo.query({
      username,
      offset,
      limit,
    });

    const queryUsersResponse = users.map((user) => ({
      id: user.id.value,
      username: user.username.value,
      profileImgUrl: user.profileImgUrl.value,
      followedBy: user.followedBy.map((id) => id.value),
      email: user.email.value,
      work: user.work?.value,
      bio: user.bio?.value,
      education: user.education?.value,
      interest: user.interest?.value,
      location: user.location?.value,
      themePreference: user.themePreference,
    }));

    return queryUsersResponse;
  }
}

export default QueryUsersUseCase; 