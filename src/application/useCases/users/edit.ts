import { inject, injectable } from "inversify";
import { Result, Ok, Err } from "ts-results-es";
import IUserRepository from "@domain/repositories/IUserRepository";
import User from "@domain/entities/User";

import CONSTANTS from "@containers/constants";
import Bio from "@domain/entities/User/Bio";
import Work from "@domain/entities/User/Work";
import Education from "@domain/entities/User/Education";
import Interest from "@domain/entities/User/Interest";
import Location from "@domain/entities/User/Location";
import Url from "@domain/common/Url";
import { ValidationError } from "@domain/errors";
import { ThemePreference } from "@domain/entities/User";

//  type EditUserCommand = Partial<{...}>; is not used as swagger UI parses it weirdly

export type EditUserCommand = Partial<{
  work: string;
  bio: string;
  education: string;
  interest: string;
  location: string;
  /**
   * S3 url of the profile image. Generate a presigned url using /files/upload-url and use the url to save the image to s3 (Automatically handled by the frontend). After saving, the url can be used in this request to indicate your new profile image
   */
  profileImgUrl: string;
  themePreference: ThemePreference;
}>;

@injectable()
class EditUser {
  private userRepo: IUserRepository;

  constructor(@inject(CONSTANTS.UserRepository) userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  public async execute(
    command: EditUserCommand,
    requestor: User,
  ): Promise<Result<void, ValidationError>> {
    const updates: any = {};

    if (command.work !== undefined) {
      const workResult = Work.create(command.work);
      if (workResult.isErr()) {
        return Err(workResult.error);
      }
      updates.work = workResult.value;
    }

    if (command.bio !== undefined) {
      const bioResult = Bio.create(command.bio);
      if (bioResult.isErr()) {
        return Err(bioResult.error);
      }
      updates.bio = bioResult.value;
    }

    if (command.education !== undefined) {
      const educationResult = Education.create(command.education);
      if (educationResult.isErr()) {
        return Err(educationResult.error);
      }
      updates.education = educationResult.value;
    }

    if (command.interest !== undefined) {
      const interestResult = Interest.create(command.interest);
      if (interestResult.isErr()) {
        return Err(interestResult.error);
      }
      updates.interest = interestResult.value;
    }

    if (command.location !== undefined) {
      const locationResult = Location.create(command.location);
      if (locationResult.isErr()) {
        return Err(locationResult.error);
      }
      updates.location = locationResult.value;
    }

    if (command.profileImgUrl !== undefined) {
      const urlResult = Url.create(command.profileImgUrl);
      if (urlResult.isErr()) {
        return Err(urlResult.error);
      }
      updates.profileImgUrl = urlResult.value;
    }

    if (command.themePreference !== undefined) {
      updates.themePreference = command.themePreference;
    }

    requestor.updateProfileInfo(updates);
    await this.userRepo.save(requestor);
    return Ok.EMPTY;
  }
}

export default EditUser;
