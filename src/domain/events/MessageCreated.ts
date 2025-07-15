import { IDomainEvent } from "@domain/core/IDomainEvent";
import Message from "@domain/entities/Message";

class MessageCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public message: Message;

  constructor(message: Message) {
    this.dateTimeOccurred = new Date();
    this.message = message;
  }
}
export default MessageCreated;
