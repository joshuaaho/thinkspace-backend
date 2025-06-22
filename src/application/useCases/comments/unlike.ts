import { inject, injectable } from "inversify";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import { Result, Err, Ok } from "ts-results-es";
import { ResourceNotFoundError } from "@application/useCases/errors";
import User from "@domain/entities/User";
import { NotLikedCommentError } from "@domain/errors";
import CONSTANTS from "@containers/constants";

export type UnlikeCommentCommand = {
  commentId: string;
};

@injectable()
class UnlikeComment {
  private commentRepository: ICommentRepository;

  constructor(
    @inject(CONSTANTS.CommentRepository) commentRepository: ICommentRepository
  ) {
    this.commentRepository = commentRepository;
  }

  async execute(
    command: UnlikeCommentCommand,
    requestor: User
  ): Promise<Result<void, ResourceNotFoundError | NotLikedCommentError>> {
    const someComment = await this.commentRepository.findById(
      command.commentId
    );

    if (someComment.isNone()) {
      return Err(new ResourceNotFoundError("Comment not found"));
    }

    const comment = someComment.value;
    const result = comment.removeLikeFromUser(requestor.id);

    if (result.isErr()) {
      return result;
    }

    await this.commentRepository.save(comment);
    return Ok.EMPTY;
  }
}

export default UnlikeComment;
