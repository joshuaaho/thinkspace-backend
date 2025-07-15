import { IHandle } from "@domain/core/IEventHandler";
import MessageCreated from "@domain/events/MessageCreated";
import { DomainEvents } from "@domain/events/DomainEvents";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IMessageService from "@application/services/IMessageService";
import IUserRepository from "@domain/repositories/IUserRepository";

@injectable()
class SendMessageOnMessageCreated implements IHandle {
  private messageService: IMessageService;
  private userRepository: IUserRepository;

  constructor(
    @inject(CONSTANTS.MessageService) messageService: IMessageService,
    @inject(CONSTANTS.UserRepository) userRepository: IUserRepository,
  ) {
    this.messageService = messageService;
    this.userRepository = userRepository;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      this.onMessageCreated.bind(this),
      MessageCreated.name,
    );
  }

  public async onMessageCreated(event: MessageCreated) {
    const { message } = event;

    const userResult = await this.userRepository.findById(
      message.receiverId.value,
    );

    const user = userResult.unwrap();

    const messageDto = {
      id: message.id.value,
      username: user.username.value,
      profileImgUrl: user.profileImgUrl.value,
      content: message.text.value,
      createdAt: message.createdAt.toString(),
      otherParticipantId: message.senderId.value,
      isFromCurrentUser: false,
    };

    this.messageService.sendMessage(messageDto, message.receiverId.value);
  }
}

export default SendMessageOnMessageCreated;
