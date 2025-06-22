import { Err, Ok, Result } from "ts-results-es";
import IUserRepository from "@domain/repositories/IUserRepository";
import { injectable, inject } from "inversify";
import { ValidationError } from "@domain/errors";
import CONSTANTS from "@containers/constants";
import User from "@domain/entities/User";
import Username from "@domain/entities/User/Username";
import Password from "@domain/entities/User/Password";
import Email from "@domain/entities/User/Email";
import { ConflictError } from "@application/useCases/errors";

export interface RegisterCommand {
  username: string;
  password: string;
  email: string;
}

@injectable()
class RegisterUseCase {
  public userRepo: IUserRepository;

  constructor(@inject(CONSTANTS.UserRepository) userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  public async execute(
    request: RegisterCommand
  ): Promise<Result<void, ValidationError | ConflictError>> {
    const someUserUsername = await this.userRepo.findByUsername(
      request.username
    );
    if (someUserUsername.isSome()) {
      return Err(new ConflictError("User has been taken"));
    }

    const someUserEmail = await this.userRepo.findByEmail(request.email);
    if (someUserEmail.isSome()) {
      return Err(new ConflictError("User email has been taken"));
    }

    const usernameOrError = Username.create(request.username);
    if (usernameOrError.isErr()) {
      return Err(usernameOrError.error);
    }

    const passwordOrError = Password.create({ value: request.password });
    if (passwordOrError.isErr()) {
      return Err(passwordOrError.error);
    }
    const emailOrError = Email.create(request.email);
    if (emailOrError.isErr()) {
      return Err(emailOrError.error);
    }
    const user = User.create({
      username: usernameOrError.value,
      password: passwordOrError.value,
      email: emailOrError.value,
    });

    await this.userRepo.save(user);
    return Ok.EMPTY;
  }
}

export default RegisterUseCase;
