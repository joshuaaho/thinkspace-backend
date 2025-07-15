import { Err, Ok, Result } from "ts-results-es";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import { injectable, inject } from "inversify";
import { ResourceNotFoundError } from "@application/useCases/errors";
import {
  AlreadyLikedCommentError,
  SelfLikedCommentError,
} from "@domain/errors";
import CONSTANTS from "@containers/constants";
import User from "@domain/entities/User";

export type LikeCommentCommand = {
  commentId: string;
};

@injectable()
class LikeComment {
  private commentRepo: ICommentRepository;

  constructor(
    @inject(CONSTANTS.CommentRepository) commentRepo: ICommentRepository,
  ) {
    this.commentRepo = commentRepo;
  }

  public async execute(
    request: LikeCommentCommand,
    requestor: User,
  ): Promise<
    Result<
      void,
      AlreadyLikedCommentError | ResourceNotFoundError | SelfLikedCommentError
    >
  > {
    const someComment = await this.commentRepo.findById(request.commentId);
    if (someComment.isNone()) {
      return Err(new ResourceNotFoundError("Comment not found"));
    }

    const comment = someComment.value;
    const someError = comment.addLikeFromUser(requestor.id);
    if (someError.isErr()) {
      return someError;
    }

    await this.commentRepo.save(comment);
    return Ok.EMPTY;
  }
}

export default LikeComment;
