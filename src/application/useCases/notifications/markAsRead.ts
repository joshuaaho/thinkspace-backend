import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import User from "@domain/entities/User";

/**
 * Filter to mark notifications as read
 */
export interface MarkAsReadCommand {
  redirectToResourceType?: string;
  resourceId?: string;
}

@injectable()
class MarkAsRead {
  private notificationRepo: INotificationRepository;

  constructor(
    @inject(CONSTANTS.NotificationRepository)
    notificationRepo: INotificationRepository,
  ) {
    this.notificationRepo = notificationRepo;
  }

  public async execute(
    command: MarkAsReadCommand,
    requestor: User,
  ): Promise<void> {
    const notifications = await this.notificationRepo.findAllBy({
      redirectToResourceType: command.redirectToResourceType,
      resourceId: command.resourceId,
      to: requestor.id.value,
    });

    notifications.forEach((notification) => notification.markAsRead());
    await this.notificationRepo.saveMany(notifications);
  }
}

export default MarkAsRead;
