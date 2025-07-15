import { IDomainEvent } from "@domain/core/IDomainEvent";
import Comment from "@domain/entities/Comment";

class CommentDeleted implements IDomainEvent {
  public dateTimeOccurred: Date;
  public comment: Comment;

  constructor(comment: Comment) {
    this.dateTimeOccurred = new Date();
    this.comment = comment;
  }
}

export default CommentDeleted;
