import { WithId } from "mongodb";
import EntityId from "@domain/core/EntityId";
import { IDataMapper } from "@domain/core/IMapper";
import Notification from "@domain/entities/Notification";

export interface MongoNotification {
  _id?: WithId<Document>["_id"];
  id: string;
  to: string;
  from: string;
  message: string;
  isRead: boolean;
  resourceId: string;
  redirectToResourceType: string;
  createdAt: string;
}

class MongoNotificationMapper implements IDataMapper<Notification> {
  toDomain(dalEntity: MongoNotification): Notification {
    return Notification.create({
      id: EntityId.create(dalEntity.id),
      to: EntityId.create(dalEntity.to),
      from: EntityId.create(dalEntity.from),
      message: dalEntity.message,
      isRead: dalEntity.isRead,
      resourceId: dalEntity.resourceId,
      redirectToResourceType: dalEntity.redirectToResourceType,
      createdAt: new Date(dalEntity.createdAt),
    });
  }

  toDalEntity(entity: Notification): MongoNotification {
    return {
      id: entity.id.value,
      to: entity.to.value,
      from: entity.from.value,
      message: entity.message,
      isRead: entity.isRead,
      resourceId: entity.resourceId,
      redirectToResourceType: entity.redirectToResourceType,
      createdAt: entity.createdAt.toString(),
    };
  }
}

export default MongoNotificationMapper;
