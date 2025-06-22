import Notification from "@domain/entities/Notification";

export default interface INotificationService {
  sendNotification(notification: Notification): Promise<void>;
  sendNotifications(notifications: Notification[]): Promise<void>;
} 