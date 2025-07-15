import { IHandle } from "@domain/core/IEventHandler";
import CommentCreated from "@domain/events/CommentCreated";
import { DomainEvents } from "@domain/events/DomainEvents";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import INotificationService from "@application/services/INotificationService";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import Notification from "@domain/entities/Notification";

@injectable()
class NotifyCommentAuthorOnCommentCreated implements IHandle {
  private userRepo: IUserRepository;
  private commentRepo: ICommentRepository;
  private notificationService: INotificationService;
  private notificationRepo: INotificationRepository;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
    @inject(CONSTANTS.CommentRepository) commentRepo: ICommentRepository,
    @inject(CONSTANTS.NotificationService)
    notificationService: INotificationService,
    @inject(CONSTANTS.NotificationRepository)
    notificationRepo: INotificationRepository,
  ) {
    this.userRepo = userRepo;
    this.commentRepo = commentRepo;
    this.notificationService = notificationService;
    this.notificationRepo = notificationRepo;
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onCommentCreated.bind(this),
      CommentCreated.name,
    );
  }

  public async onCommentCreated(event: CommentCreated): Promise<void> {
    const { comment } = event;

    if (!comment.parentCommentId) {
      return;
    }

    const parentComment = (
      await this.commentRepo.findById(comment.parentCommentId.value)
    ).unwrap();

    if (comment.authorId.equals(parentComment.authorId)) {
      return;
    }

    const parentCommentAuthor = (
      await this.userRepo.findById(parentComment.authorId.value)
    ).unwrap();

    const author = (
      await this.userRepo.findById(comment.authorId.value)
    ).unwrap();

    const notification = Notification.create({
      to: parentCommentAuthor.id,
      from: author.id,
      message: `${author.username.value} replied to your comment: "${comment.content.value}"`,
      isRead: false,
      resourceId: comment.postId.value,
      redirectToResourceType: "posts",
    });

    await this.notificationRepo.save(notification);

    await this.notificationService.sendNotification(notification);
  }
}

export default NotifyCommentAuthorOnCommentCreated;
