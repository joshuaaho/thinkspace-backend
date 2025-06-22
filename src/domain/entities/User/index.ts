import BaseEntity from "@domain/core/BaseEntity";
import Username from "./Username";
import Email from "./Email";
import Password from "./Password";
import { Result, Ok, Err } from "ts-results-es";
import { InvalidRequestError } from "@application/useCases/errors";

import { RefreshToken } from "@application/services/IAuthService";
import EntityId from "@domain/core/EntityId";
import Url from "@domain/common/Url";
import Work from "./Work";
import Bio from "./Bio";
import Education from "./Education";
import Interest from "./Interest";
import Location from "./Location";

function getRandomProfileImage(): string {
  const profileImages = [
    "https://thinkspace1506.s3.us-east-1.amazonaws.com/70865fc6-d842-4993-9f80-de1223d40987.jpg",
    "https://thinkspace1506.s3.us-east-1.amazonaws.com/165e8069-2728-482b-a939-462a8c24af66.jpg"
  ]

  const randomIndex = Math.floor(Math.random() * profileImages.length);
  return profileImages[randomIndex];
}

interface UserProps {
  id?: EntityId;
  username: Username;
  email: Email;
  password: Password;
  refreshToken?: RefreshToken;
  work?: Work;
  bio?: Bio;
  education?: Education;
  interest?: Interest;
  location?: Location;
  profileImgUrl?: Url;
  themePreference?: ThemePreference;
  followedBy?: EntityId[];
}


export type ThemePreference = "light" | "dark" | "system";
export class User extends BaseEntity {
  private readonly _username: Username;
  private readonly _email: Email;
  private readonly _password: Password;
  private _themePreference: ThemePreference;
  private _profileImgUrl: Url;
  private _refreshToken: RefreshToken | undefined;
  private _work: Work | undefined;
  private _bio: Bio | undefined;
  private _education: Education | undefined;
  private _interest: Interest | undefined;
  private _location: Location | undefined;
  private _followedBy: EntityId[];

  private constructor(props: UserProps) {
    super(props.id);
    this._username = props.username;
    this._email = props.email;
    this._password = props.password;
    this._refreshToken = props.refreshToken;
    this._work = props.work;
    this._bio = props.bio;
    this._education = props.education;
    this._interest = props.interest;
    this._location = props.location;
    this._profileImgUrl =
      props.profileImgUrl ||
      Url.create(getRandomProfileImage()).unwrap();
    this._themePreference = props.themePreference || "light";
    this._followedBy = props.followedBy || [];
  }

  public static create(props: UserProps): User {
    return new User(props);
  }

  public get username() {
    return this._username
  }

  public get email() {
    return this._email
  }

  public get password() {
    return this._password;
  }

  public get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  public get profileImgUrl() {
    return this._profileImgUrl;
  }

  public get themePreference() {
    return this._themePreference;
  }

  public get work(): Work | undefined {
    return this._work;
  }

  public get bio(): Bio | undefined {
    return this._bio;
  }

  public get education(): Education | undefined {
    return this._education;
  }

  public get interest(): Interest | undefined {
    return this._interest;
  }

  public get location(): Location | undefined {
    return this._location;
  }

  public get followedBy(): EntityId[] {
    return [...this._followedBy]; // Return a copy to prevent direct modification
  }

  public isFollowedBy(userId: EntityId): boolean {
    return this._followedBy.some(followerId => followerId.equals(userId));
  }

  public acceptFollowFromUser(userId: EntityId): Result<void, InvalidRequestError> {
    // Cannot follow yourself
    if (userId.equals(this.id)) {
      return Err(new InvalidRequestError("Cannot follow yourself"));
    }

    // Check if already following
    if (this.isFollowedBy(userId)) {
      return Err(new InvalidRequestError("User is already following"));
    }

    // Add follower
    this._followedBy.push(userId);
    return Ok.EMPTY;
  }

  public removeFollower(userId: EntityId): Result<void, InvalidRequestError> {
    // Check if not following
    if (!this.isFollowedBy(userId)) {
      return Err(new InvalidRequestError("User is not following"));
    }

    // Remove follower
    this._followedBy = this._followedBy.filter(followerId => !followerId.equals(userId));
    return Ok.EMPTY;
  }

  public set themePreference(themePreference: ThemePreference) {
    this._themePreference = themePreference;
  }

  public set refreshToken(refreshToken) {
    this._refreshToken = refreshToken;
  }

  public updateProfileInfo(props: Pick<UserProps, "work" | "bio" | "education" | "interest" | "location" | "profileImgUrl" | "themePreference">) {
    this._work = props.work;
    this._bio = props.bio;
    this._education = props.education;
    this._interest = props.interest;
    this._location = props.location;

    if (props.themePreference) {
      this._themePreference = props.themePreference;
    }

    if (props.profileImgUrl) {
      this._profileImgUrl = props.profileImgUrl;
    }
  }
}

export default User;
