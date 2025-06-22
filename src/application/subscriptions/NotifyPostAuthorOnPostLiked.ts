import { IHandle } from "@domain/core/IEventHandler";
import PostLiked from "@domain/events/PostLiked";
import { DomainEvents } from "@domain/events/DomainEvents";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import INotificationService from "@application/services/INotificationService";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import Notification from "@domain/entities/Notification";

@injectable()
class NotifyPostAuthorOnPostLiked implements IHandle {
  private userRepo: IUserRepository;
  private notificationService: INotificationService;
  private notificationRepo: INotificationRepository;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
    @inject(CONSTANTS.NotificationService)
    notificationService: INotificationService,
    @inject(CONSTANTS.NotificationRepository)
    notificationRepo: INotificationRepository
  ) {
    this.userRepo = userRepo;
    this.notificationService = notificationService;
    this.notificationRepo = notificationRepo;
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onPostLiked.bind(this), PostLiked.name);
  }

  public async onPostLiked(event: PostLiked): Promise<void> {
    const { post } = event;

    // Get the post author
    const author = (await this.userRepo.findById(post.authorId.value)).unwrap();

    // Get the most recent user who liked the post (last in the likedBy array)
    const mostRecentLikerId = post.likedBy[post.likedBy.length - 1];
    const liker = (
      await this.userRepo.findById(mostRecentLikerId.value)
    ).unwrap();

    // Create notification for the post author
    const notification = Notification.create({
      to: author.id,
      from: liker.id,
      message: `${liker.username.value} liked your post "${post.title.value}"`,
      isRead: false,
      resourceId: post.id.value,
      redirectToResourceType: "posts",
    });

    // Save notification to the database
    await this.notificationRepo.save(notification);

    // Send notification through the notification service
    await this.notificationService.sendNotification(notification);
  }
}

export default NotifyPostAuthorOnPostLiked;
