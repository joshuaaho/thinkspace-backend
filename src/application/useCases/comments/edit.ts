import { Err, Ok, Result } from "ts-results-es";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import { injectable, inject } from "inversify";
import CONSTANTS from "@containers/constants";
import {
  ResourceNotFoundError,
  UnauthorizedError,
} from "@application/useCases/errors";
import { ValidationError } from "@domain/errors";
import Content from "@domain/entities/Comment/Content";
import User from "@domain/entities/User";

export type EditCommentCommand = {
  content: string;
  commentId: string;
};

@injectable()
class EditComment {
  private commentRepo: ICommentRepository;

  constructor(
    @inject(CONSTANTS.CommentRepository) commentRepo: ICommentRepository,
  ) {
    this.commentRepo = commentRepo;
  }

  public async execute(
    request: EditCommentCommand,
    requestor: User,
  ): Promise<
    Result<void, ValidationError | UnauthorizedError | ResourceNotFoundError>
  > {
    const someComment = await this.commentRepo.findById(request.commentId);
    if (someComment.isNone()) {
      return Err(new ResourceNotFoundError("Comment not found"));
    }

    const comment = someComment.value;

    const contentOrError = Content.create(request.content);
    if (contentOrError.isErr()) {
      return contentOrError;
    }
    const someError = comment.updateFromUserEdits(
      requestor,
      contentOrError.value,
    );
    if (someError.isErr()) {
      return someError;
    }

    await this.commentRepo.save(comment);
    return Ok.EMPTY;
  }
}

export default EditComment;
