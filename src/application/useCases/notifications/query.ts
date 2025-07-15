import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import User from "@domain/entities/User";
import IUserRepository from "@domain/repositories/IUserRepository";

export interface QueryNotificationsCommand {
  offset?: number;
  limit?: number;
}

export type QueryNotificationsResponse = {
  id: string;

  /**
   * The profile image url of the user who sent the notification
   */
  fromProfileImgUrl: string;

  message: string;
  isRead: boolean;

  /**
   * The id of a specific "ResrouceType"
   */
  resourceId: string;

  /**
   * Metadata on what type of resource should be redirected to after clicking the notification
   */
  redirectToResourceType: string;

  createdAt: string;
}[];

@injectable()
class QueryNotifications {
  private notificationRepo: INotificationRepository;
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.NotificationRepository)
    notificationRepo: INotificationRepository,
    @inject(CONSTANTS.UserRepository)
    userRepo: IUserRepository,
  ) {
    this.notificationRepo = notificationRepo;
    this.userRepo = userRepo;
  }

  public async execute(
    command: QueryNotificationsCommand,
    requestor: User,
  ): Promise<QueryNotificationsResponse> {
    const notifications = await this.notificationRepo.query({
      to: requestor.id.value,
      offset: command.offset,
      limit: command.limit,
    });

    return Promise.all(
      notifications.map(async (notification) => {
        const fromUser = (
          await this.userRepo.findById(notification.from.value)
        ).unwrap();
        return {
          id: notification.id.value,
          fromProfileImgUrl: fromUser.profileImgUrl.value,
          message: notification.message,
          isRead: notification.isRead,
          resourceId: notification.resourceId,
          redirectToResourceType: notification.redirectToResourceType,
          createdAt: notification.createdAt.toString(),
        };
      }),
    );
  }
}

export default QueryNotifications;
