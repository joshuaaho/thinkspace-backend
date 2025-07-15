import { IHandle } from "@domain/core/IEventHandler";
import CommentDeleted from "@domain/events/CommentDeleted";
import { DomainEvents } from "@domain/events/DomainEvents";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import ICommentRepository from "@domain/repositories/ICommentRepository";

@injectable()
class DeleteRepliesOnCommentDeleted implements IHandle {
  private commentRepo: ICommentRepository;

  constructor(
    @inject(CONSTANTS.CommentRepository) commentRepo: ICommentRepository,
  ) {
    this.commentRepo = commentRepo;
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onCommentDeleted.bind(this),
      CommentDeleted.name,
    );
  }

  public async onCommentDeleted(event: CommentDeleted) {
    const { comment } = event;

    const replies = await this.commentRepo.query({
      parentCommentId: comment.id.value,
    });

    for (const reply of replies) {
      reply.addDomainEvent(new CommentDeleted(reply));
    }

    await this.commentRepo.deleteMany({ parentCommentId: comment.id.value });
  }
}

export default DeleteRepliesOnCommentDeleted;
