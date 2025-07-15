import EntityId from "@domain/core/EntityId";
import { IDataMapper } from "@domain/core/IMapper";
import User from "@domain/entities/User";
import Username from "@domain/entities/User/Username";
import Email from "@domain/entities/User/Email";
import Password from "@domain/entities/User/Password";
import Work from "@domain/entities/User/Work";
import Bio from "@domain/entities/User/Bio";
import Education from "@domain/entities/User/Education";
import Interest from "@domain/entities/User/Interest";
import Location from "@domain/entities/User/Location";
import Url from "@domain/common/Url";

export interface MongoUser {
  id: string;
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
  work?: string;
  bio?: string;
  education?: string;
  interest?: string;
  location?: string;
  profileImgUrl?: string;
  themePreference?: "light" | "dark";
  followedBy: string[];
}

class MongoUserMapper implements IDataMapper<User> {
  toDomain(mongoUser: MongoUser): User {
    const {
      id,
      username,
      email,
      password,
      refreshToken,
      work,
      bio,
      education,
      interest,
      location,
      profileImgUrl,
      themePreference,
      followedBy,
    } = mongoUser;

    const user = User.create({
      id: EntityId.create(id),
      username: Username.create(username).unwrap(),
      email: Email.create(email).unwrap(),
      password: Password.create({ value: password, hashed: true }).unwrap(),
      refreshToken: refreshToken,
      work: work ? Work.create(work).unwrap() : undefined,
      bio: bio ? Bio.create(bio).unwrap() : undefined,
      education: education ? Education.create(education).unwrap() : undefined,
      interest: interest ? Interest.create(interest).unwrap() : undefined,
      location: location ? Location.create(location).unwrap() : undefined,
      profileImgUrl: profileImgUrl
        ? Url.create(profileImgUrl).unwrap()
        : undefined,
      themePreference: themePreference,
      followedBy: (followedBy || []).map((id) => EntityId.create(id)),
    });

    return user;
  }

  toDalEntity(user: User) {
    return {
      id: user.id.value,
      username: user.username.value,
      email: user.email.value,
      password: user.password.value,
      refreshToken: user.refreshToken,
      work: user.work?.value,
      bio: user.bio?.value,
      education: user.education?.value,
      interest: user.interest?.value,
      location: user.location?.value,
      profileImgUrl: user.profileImgUrl?.value,
      themePreference: user.themePreference,
      followedBy: user.followedBy.map((id) => id.value),
    };
  }
}

export default MongoUserMapper;
