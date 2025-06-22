import Notification from '@domain/entities/Notification';
import IRepository from '@domain/repositories/IRepository';
import { BaseQueryOptions } from '@domain/repositories/types';

export type FindAllOptions = Partial<{
  redirectToResourceType: string;
  resourceId: string;
  to: string;
  from: string;
}>;

export type NotificationQueryOptions = BaseQueryOptions & Partial<{
  to: string;
}>;




interface INotificationRepository extends IRepository<Notification> {
  query(queryOptions: Partial<NotificationQueryOptions>): Promise<Notification[]>;
  saveMany(notifications: Notification[]): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
  findAllBy(queryOptions: FindAllOptions): Promise<Notification[]>;
}

export default INotificationRepository; 