import { IHandle } from "@domain/core/IEventHandler";
import CommentCreated from "@domain/events/CommentCreated";
import { DomainEvents } from "@domain/events/DomainEvents";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import INotificationService from "@application/services/INotificationService";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import IPostRepository from "@domain/repositories/IPostRepository";
import Notification from "@domain/entities/Notification";

@injectable()
class NotifyPostAuthorOnCommentCreated implements IHandle {
  private userRepo: IUserRepository;
  private postRepo: IPostRepository;
  private notificationService: INotificationService;
  private notificationRepo: INotificationRepository;

  constructor(
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
    @inject(CONSTANTS.PostRepository) postRepo: IPostRepository,
    @inject(CONSTANTS.NotificationService)
    notificationService: INotificationService,
    @inject(CONSTANTS.NotificationRepository)
    notificationRepo: INotificationRepository,
  ) {
    this.userRepo = userRepo;
    this.postRepo = postRepo;
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

    const author = (
      await this.userRepo.findById(comment.authorId.value)
    ).unwrap();

    const post = (await this.postRepo.findById(comment.postId.value)).unwrap();

    const postAuthor = (
      await this.userRepo.findById(post.authorId.value)
    ).unwrap();

    if (!postAuthor.id.equals(author.id)) {
      const notification = Notification.create({
        to: postAuthor.id,
        from: author.id,
        message: `${author.username.value} commented on your post`,
        isRead: false,
        resourceId: post.id.value,
        redirectToResourceType: "posts",
      });

      await this.notificationRepo.save(notification);

      await this.notificationService.sendNotification(notification);
    }
  }
}

export default NotifyPostAuthorOnCommentCreated;
