import { IHandle } from "@domain/core/IEventHandler";
import MessageCreated from "@domain/events/MessageCreated";
import { DomainEvents } from "@domain/events/DomainEvents";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import INotificationService from "@application/services/INotificationService";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import Notification from "@domain/entities/Notification";


@injectable()
class NotifyReceiverOnMessageCreated implements IHandle {
  private userRepo: IUserRepository;
  private notificationService: INotificationService;
  private notificationRepo: INotificationRepository;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
    @inject(CONSTANTS.NotificationService) notificationService: INotificationService,
    @inject(CONSTANTS.NotificationRepository) notificationRepo: INotificationRepository
  ) {
    this.userRepo = userRepo;
    this.notificationService = notificationService;
    this.notificationRepo = notificationRepo;
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onMessageCreated.bind(this), MessageCreated.name);
  }

  public async onMessageCreated(event: MessageCreated): Promise<void> {
    const { message } = event;
    
    // Get the message sender
    const sender = (await this.userRepo.findById(message.senderId.value)).unwrap();
    
    // Get the message receiver
    const receiver = (await this.userRepo.findById(message.receiverId.value)).unwrap();
    
    // Create notification for the receiver
    const notification = Notification.create({
      to: receiver.id,
      from: sender.id,
      message: `${sender.username.value} sent you a message`,
      isRead: false,
      resourceId: message.senderId.value,
      redirectToResourceType: "messages"
    });
    
    // Save notification to the database
    await this.notificationRepo.save(notification);
    
    // Send notification through the notification service
    await this.notificationService.sendNotification(notification);
  }
}

export default NotifyReceiverOnMessageCreated;
