import { IHandle } from "@domain/core/IEventHandler";
import CommentLiked from "@domain/events/CommentLiked";
import { DomainEvents } from "@domain/events/DomainEvents";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import INotificationService from "@application/services/INotificationService";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import Notification from "@domain/entities/Notification";

@injectable()
class NotifyCommentAuthorOnCommentLiked implements IHandle {
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
    DomainEvents.register(this.onCommentLiked.bind(this), CommentLiked.name);
  }

  public async onCommentLiked(event: CommentLiked): Promise<void> {
    const { comment } = event;

    const author = (
      await this.userRepo.findById(comment.authorId.value)
    ).unwrap();

    const mostRecentLikerId = comment.likedBy[comment.likedBy.length - 1];
    const liker = (
      await this.userRepo.findById(mostRecentLikerId.value)
    ).unwrap();

    const notification = Notification.create({
      to: author.id,
      from: liker.id,
      message: `${liker.username.value} liked your comment`,
      isRead: false,
      resourceId: comment.postId.value,
      redirectToResourceType: "posts",
    });

    await this.notificationRepo.save(notification);

    await this.notificationService.sendNotification(notification);
  }
}

export default NotifyCommentAuthorOnCommentLiked;
