import { Err, Ok, Result } from "ts-results-es";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import { injectable, inject } from "inversify";
import {
  ResourceNotFoundError,
  UnauthorizedError,
} from "@application/useCases/errors";
import CONSTANTS from "@containers/constants";
import CommentDeleted from "@domain/events/CommentDeleted";
import User from "@domain/entities/User";

export type DeleteCommentCommand = {
  commentId: string;
};

@injectable()
class DeleteComment {
  private commentRepo: ICommentRepository;

  constructor(
    @inject(CONSTANTS.CommentRepository) commentRepo: ICommentRepository
  ) {
    this.commentRepo = commentRepo;
  }

  public async execute(
    request: DeleteCommentCommand,
    requestor: User
  ): Promise<
    Result<
      void,
      ResourceNotFoundError | UnauthorizedError
    >
  > {
    const someComment = await this.commentRepo.findById(request.commentId);
    if (someComment.isNone()) {
      return Err(new ResourceNotFoundError("Comment not found"));
    }

    const comment = someComment.value;
    if (!comment.canBeDeletedBy(requestor.id)) {
      return Err(
        new UnauthorizedError("User is not authorized to delete this comment")
      );
    }

    comment.addDomainEvent(new CommentDeleted(comment));
    await this.commentRepo.delete(comment.id);

    return Ok.EMPTY;
  }
}

export default DeleteComment;
