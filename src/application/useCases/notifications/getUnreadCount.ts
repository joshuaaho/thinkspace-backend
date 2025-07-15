import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import User from "@domain/entities/User";

export type GetUnreadCountResponse = {
  unreadCount: number;
};

@injectable()
class GetUnreadCount {
  private notificationRepo: INotificationRepository;

  constructor(
    @inject(CONSTANTS.NotificationRepository)
    notificationRepo: INotificationRepository,
  ) {
    this.notificationRepo = notificationRepo;
  }

  public async execute(requestor: User): Promise<GetUnreadCountResponse> {
    const count = await this.notificationRepo.getUnreadCount(
      requestor.id.value,
    );
    return { unreadCount: count };
  }
}

export default GetUnreadCount;
