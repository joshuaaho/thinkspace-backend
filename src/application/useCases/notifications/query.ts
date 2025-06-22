import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import User from "@domain/entities/User";
import IUserRepository from "@domain/repositories/IUserRepository";

export type QueryNotificationsCommand = Partial<{
  offset: number;   
  limit: number;
}>;

export type QueryNotificationsResponse = {
  id: string;
  fromProfileImgUrl: string;
  message: string;
  isRead: boolean;
  resourceId: string;
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
    userRepo: IUserRepository
  ) {
    this.notificationRepo = notificationRepo;
    this.userRepo = userRepo;
  }

  public async execute(
    command: QueryNotificationsCommand,
    requestor: User
  ): Promise<QueryNotificationsResponse> {
    const notifications = await this.notificationRepo.query({
      to: requestor.id.value,
      offset: command.offset,
      limit: command.limit,
    });

    return Promise.all(
      notifications.map(async (notification) => {
        const fromUser = (await this.userRepo.findById(notification.from.value)).unwrap();
        return {
          id: notification.id.value,
          fromProfileImgUrl: fromUser.profileImgUrl.value,
          message: notification.message,
          isRead: notification.isRead,
          resourceId: notification.resourceId,
          redirectToResourceType: notification.redirectToResourceType,
          createdAt: notification.createdAt.toString(),
        };
      })
    );
  }
}

export default QueryNotifications; 