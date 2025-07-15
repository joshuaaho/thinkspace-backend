import { Err, Ok, Result } from "ts-results-es";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IMessageRepository from "@domain/repositories/IMessageRepository";
import IUserRepository from "@domain/repositories/IUserRepository";
import EntityId from "@domain/core/EntityId";
import Text from "@domain/entities/Message/Text";
import Message from "@domain/entities/Message";
import User from "@domain/entities/User";
import { ValidationError } from "@domain/errors";
import {
  InvalidRequestError,
  ResourceNotFoundError,
} from "@application/useCases/errors";

export type CreateMessageCommand = {
  text: string;
  recipientId: string;
};

@injectable()
class CreateMessage {
  private messageRepo: IMessageRepository;
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.MessageRepository) messageRepo: IMessageRepository,
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
  ) {
    this.messageRepo = messageRepo;
    this.userRepo = userRepo;
  }

  public async execute(
    command: CreateMessageCommand,
    requestor: User,
  ): Promise<
    Result<void, ValidationError | ResourceNotFoundError | InvalidRequestError>
  > {
    if (requestor.id.value === command.recipientId) {
      return Err(
        new InvalidRequestError("You cannot send a message to yourself"),
      );
    }

    const recipientResult = await this.userRepo.findById(command.recipientId);
    if (recipientResult.isNone()) {
      return Err(new ResourceNotFoundError("Recipient not found"));
    }

    const textOrError = Text.create(command.text);
    if (textOrError.isErr()) {
      return Err(new ValidationError(textOrError.error.message));
    }

    const message = Message.create({
      text: textOrError.value,
      senderId: requestor.id,
      receiverId: EntityId.create(command.recipientId),
    });

    await this.messageRepo.save(message);

    return Ok.EMPTY;
  }
}

export default CreateMessage;
