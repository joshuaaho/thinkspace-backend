
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IMessageRepository from "@domain/repositories/IMessageRepository";
import IUserRepository from "@domain/repositories/IUserRepository";
import User from "@domain/entities/User";

export type GetChatListResponse = {
  id: string;
  username: string;
  profileImgUrl: string;
  content: string;
  createdAt: string;
  otherParticipantId: string;
  isFromCurrentUser: boolean;
}[];

@injectable()
class GetChatList {
  private messageRepo: IMessageRepository;
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.MessageRepository) messageRepo: IMessageRepository,
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository
  ) {
    this.messageRepo = messageRepo;
    this.userRepo = userRepo;
  }

  public async execute(
    requestor: User
  ): Promise<GetChatListResponse> {
    const messages = await this.messageRepo.getChatList(requestor.id.value);

    const chatList = await Promise.all(
      messages.map(async (message) => {


        const user = (await this.userRepo.findById(message.senderId.value)).unwrap();
        
        const otherParticipantId = message.senderId.value === requestor.id.value 
          ? message.receiverId.value 
          : message.senderId.value;

        return {
          id: message.id.value,
          username: user.username.value,
          profileImgUrl: user.profileImgUrl.value,
          content: message.text.value,
          createdAt: message.createdAt.toString(),
          otherParticipantId,
          isFromCurrentUser: message.senderId.value === requestor.id.value
        };
      })
    );

    return chatList;
  }
}

export default GetChatList;
