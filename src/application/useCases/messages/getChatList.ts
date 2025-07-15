import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IMessageRepository from "@domain/repositories/IMessageRepository";
import IUserRepository from "@domain/repositories/IUserRepository";
import User from "@domain/entities/User";

/**
 * The latest message from each of the users chat
 */
export type GetChatListResponse = {
  /**
   * Id of the message
   */
  id: string;
  /**
   * Username of the other participant in the chat
   */
  otherParticipantUsername: string;
  /**
   * Profile image url of the other participant in the chat
   */
  profileImgUrl: string;
  /**
   * Content of the message
   */
  content: string;

  createdAt: string;

  otherParticipantId: string;
}[];

@injectable()
class GetChatList {
  private messageRepo: IMessageRepository;
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.MessageRepository) messageRepo: IMessageRepository,
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
  ) {
    this.messageRepo = messageRepo;
    this.userRepo = userRepo;
  }

  public async execute(requestor: User): Promise<GetChatListResponse> {
    const messages = await this.messageRepo.getChatList(requestor.id.value);

    const chatList = await Promise.all(
      messages.map(async (message) => {
        const otherParticipantId =
          message.senderId.value === requestor.id.value
            ? message.receiverId.value
            : message.senderId.value;
        const user = (
          await this.userRepo.findById(otherParticipantId)
        ).unwrap();

        return {
          id: message.id.value,
          otherParticipantUsername: user.username.value,
          profileImgUrl: user.profileImgUrl.value,
          content: message.text.value,
          createdAt: message.createdAt.toString(),
          otherParticipantId: otherParticipantId,
        };
      }),
    );

    return chatList;
  }
}

export default GetChatList;
