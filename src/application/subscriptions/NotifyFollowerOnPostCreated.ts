import { IHandle } from "@domain/core/IEventHandler";
import PostCreated from "@domain/events/PostCreated";
import { DomainEvents } from "@domain/events/DomainEvents";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import INotificationService from "@application/services/INotificationService";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import Notification from "@domain/entities/Notification";

@injectable()
class NotifyFollowerOnPostCreated implements IHandle {
  private userRepo: IUserRepository;
  private notificationService: INotificationService;
  private notificationRepo: INotificationRepository;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
    @inject(CONSTANTS.NotificationService)
    notificationService: INotificationService,
    @inject(CONSTANTS.NotificationRepository)
    notificationRepo: INotificationRepository,
  ) {
    this.userRepo = userRepo;
    this.notificationService = notificationService;
    this.notificationRepo = notificationRepo;
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onPostCreated.bind(this), PostCreated.name);
  }

  public async onPostCreated(event: PostCreated): Promise<void> {
    const { post } = event;

    const author = (await this.userRepo.findById(post.authorId.value)).unwrap();

    const notifications = author.followedBy.map((followerId) =>
      Notification.create({
        to: followerId,
        from: author.id,
        message: `${author.username.value} created a new post: "${post.title.value}"`,
        isRead: false,
        resourceId: post.id.value,
        redirectToResourceType: "posts",
      }),
    );

    await Promise.all(
      notifications.map((notification) =>
        this.notificationRepo.save(notification),
      ),
    );

    await this.notificationService.sendNotifications(notifications);
  }
}

export default NotifyFollowerOnPostCreated;
