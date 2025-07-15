import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IMessageRepository from "@domain/repositories/IMessageRepository";
import IUserRepository from "@domain/repositories/IUserRepository";
import User from "@domain/entities/User";

export interface QueryMessagesCommand {
  otherParticipantId: string;

  offset?: number;

  limit?: number;
}

export type QueryMessagesResponse = {
  id: string;
  profileImgUrl: string;
  username: string;
  content: string;
  createdAt: string;
  otherParticipantId: string;
  isFromCurrentUser: boolean;
}[];

@injectable()
class QueryMessages {
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
    command: QueryMessagesCommand,
    requestor: User,
  ): Promise<QueryMessagesResponse> {
    const participantIds = [requestor.id.value, command.otherParticipantId];

    const messages = await this.messageRepo.query({
      participantIds,
      offset: command.offset,
      limit: command.limit,
    });

    const queryMessagesResponse = await Promise.all(
      messages.map(async (message) => {
        const user = (
          await this.userRepo.findById(message.senderId.value)
        ).unwrap();

        return {
          id: message.id.value,
          profileImgUrl: user.profileImgUrl.value,
          username: user.username.value,
          content: message.text.value,
          createdAt: message.createdAt.toString(),
          otherParticipantId:
            message.senderId.value === requestor.id.value
              ? message.receiverId.value
              : message.senderId.value,
          isFromCurrentUser: message.senderId.value === requestor.id.value,
        };
      }),
    );

    return queryMessagesResponse;
  }
}

export default QueryMessages;
