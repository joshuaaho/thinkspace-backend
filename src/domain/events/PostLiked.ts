import { IDomainEvent } from "@domain/core/IDomainEvent";
import Post from "@domain/entities/Post";

class PostLiked implements IDomainEvent {
  public dateTimeOccurred: Date;
  public post: Post;

  constructor(post: Post) {
    this.dateTimeOccurred = new Date();
    this.post = post;
  }
}

export default PostLiked; 