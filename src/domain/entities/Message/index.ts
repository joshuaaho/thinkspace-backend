
import EntityId from "@domain/core/EntityId";

import BaseEntity from "@domain/core/BaseEntity";
import Text from "@domain/entities/Message/Text";


import MessageCreated from "@domain/events/MessageCreated";

interface MessageProps {
  id?: EntityId;

  senderId: EntityId;
  text: Text;
  receiverId: EntityId;
  createdAt?: Date;
}

class Message extends BaseEntity {

  private _senderId: EntityId;
  private _text: Text;
  private _receiverId: EntityId;
  private constructor(props: any) {
    super(props.id, props.createdAt);

    this._senderId = props.senderId;
    this._text = props.text;
    this._receiverId = props.receiverId;
  }

  public static create(props: MessageProps): Message {
    const message = new Message({
      id: props.id,

      senderId: props.senderId,
      text: props.text,
      receiverId: props.receiverId,
      createdAt: props.createdAt
    });
    if (!props.id) {
      
   
      message.addDomainEvent(new MessageCreated(message));
    }
    return message;
  }

  public get senderId(): EntityId {
    return this._senderId;
  } 
  public get text(): Text {
    return this._text;
  }
  public get receiverId(): EntityId {
    return this._receiverId;
  }
}

export default Message;

