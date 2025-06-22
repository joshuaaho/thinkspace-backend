import { IHandle } from "@domain/core/IEventHandler";
import PostDeleted from "@domain/events/PostDeleted";
import { DomainEvents } from "@domain/events/DomainEvents";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import ICommentRepository from "@domain/repositories/ICommentRepository";

@injectable()
class DeleteCommentsOnPostDeleted implements IHandle {
  private commentRepo: ICommentRepository;

  constructor(@inject(CONSTANTS.CommentRepository) commentRepo: ICommentRepository) {
    this.commentRepo = commentRepo;
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onPostDeleted.bind(this), PostDeleted.name);
  }

  public async onPostDeleted(event: PostDeleted): Promise<void> {
    const { post } = event;
    await this.commentRepo.deleteMany({ postId: post.id.value });
  }
}

export default DeleteCommentsOnPostDeleted;
