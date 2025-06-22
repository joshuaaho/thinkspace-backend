import { injectable } from "inversify";
import { io, userSocketMap } from "@infrastructure/socket";
import INotificationService from "@application/services/INotificationService";
import Notification from "@domain/entities/Notification";

@injectable()
class SocketIONotificationService implements INotificationService {
  constructor() {}

  async sendNotification(notification: Notification): Promise<void> {
    io.to(userSocketMap[notification.to.value]).emit("newNotification", {
      id: notification.id.value,
      from: notification.from.value,
      message: notification.message,
      isRead: notification.isRead,
      resourceId: notification.resourceId,
      dateTimeOccurred: new Date(),
    });
  }

  async sendNotifications(notifications: Notification[]): Promise<void> {
    for (const notification of notifications) {
      await this.sendNotification(notification);
    }
  }
}

export default SocketIONotificationService;
