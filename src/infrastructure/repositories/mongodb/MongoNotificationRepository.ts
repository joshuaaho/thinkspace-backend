import { injectable } from "inversify";
import { MongoBaseRepository } from "./MongoBaseRepository";
import Notification from "@domain/entities/Notification";
import MongoNotificationMapper from "@infrastructure/mappers/MongoNotificationMapper";
import db from "@infrastructure/repositories/mongodb/MongoClient";
import INotificationRepository, {
  FindAllOptions,
  NotificationQueryOptions,
} from "@domain/repositories/INotificationRepository";

@injectable()
class MongoNotificationRepository
  extends MongoBaseRepository<Notification>
  implements INotificationRepository
{
  constructor() {
    super(db.collection("notifications"), new MongoNotificationMapper());
  }

  async saveMany(notifications: Notification[]): Promise<void> {
    for (const notification of notifications) {
   
      await this.save(notification);
    }
  }

  async findAllBy(options: FindAllOptions): Promise<Notification[]> {
    const dalEntities = await this.collectionInstance.find(options).toArray();
    return dalEntities.map((entity) => this.mapper.toDomain(entity));
  }

  async query({
    offset = 0,
    limit = 10,
    to,
  }: Partial<NotificationQueryOptions>): Promise<Notification[]> {
    const dalEntities = await this.collectionInstance
      .find({
        ...(to && { to }),
      })
      .skip(offset)
      .limit(limit)
      .toArray();

    return dalEntities.map((entity) => this.mapper.toDomain(entity));
  }

  async getUnreadCount(userId: string): Promise<number> {
    const count = await this.collectionInstance.countDocuments({
      to: userId,
      isRead: false,
    });
    return count;
  }
}

export default MongoNotificationRepository;
