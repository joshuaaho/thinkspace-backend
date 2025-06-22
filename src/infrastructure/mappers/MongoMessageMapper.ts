
import { ObjectId, WithId } from "mongodb";

import EntityId from "@domain/core/EntityId";
import { IDataMapper } from "@domain/core/IMapper";

import  Message  from "@domain/entities/Message";
import Text from "@domain/entities/Message/Text";
export interface MongoMessage extends WithId<Document> {
  id: string;
  text: string;
  senderId: string;

  createdAt: string;
  receiverId: string;
}

class MongoMessageMapper implements IDataMapper<Message> {
  toDomain(mongoMessage: MongoMessage): Message {
    const { id, text, senderId,  createdAt, receiverId } = mongoMessage;

    const message = Message.create({
      id: EntityId.create(id),
      text: Text.create(text).unwrap(),
      senderId: EntityId.create(senderId),

      receiverId: EntityId.create(receiverId),
      createdAt: new Date(createdAt)
    });

    return message;
  }
  toDalEntity(message: Message) {

    return {
      id: message.id.value,
      text: message.text.value,
      senderId: message.senderId.value,

      receiverId: message.receiverId.value,
      createdAt: message.createdAt.toString()
    };
  }
}

export default MongoMessageMapper;
