import { Err, Ok, Result } from "ts-results-es";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import { injectable, inject } from "inversify";
import Comment from "@domain/entities/Comment";
import EntityId from "@domain/core/EntityId";
import Content from "@domain/entities/Comment/Content";

import {
  ResourceNotFoundError,
  InvalidRequestError,
} from "@application/useCases/errors";
import { ValidationError } from "@domain/errors";
import User from "@domain/entities/User";
import IPostRepository from "@domain/repositories/IPostRepository";
import CONSTANTS from "@containers/constants";
import Post from "@domain/entities/Post";

export type CreateCommentCommand = {
  content: string;
  parentCommentId?: string;
  postId: string;
};

@injectable()
class CreateComment {
  private commentRepo: ICommentRepository;

  private postRepo: IPostRepository;

  constructor(
    @inject(CONSTANTS.CommentRepository) commentRepo: ICommentRepository,
    @inject(CONSTANTS.PostRepository) postRepo: IPostRepository
  ) {
    this.commentRepo = commentRepo;

    this.postRepo = postRepo;
  }

  public async execute(
    request: CreateCommentCommand,
    requestor: User
  ): Promise<
    Result<
      void,
      | ValidationError
      | InvalidRequestError
      | ResourceNotFoundError
    >
  > {
    let content: Content;
    let parentCommentId: EntityId | undefined;
    let post: Post;

    const somePost = await this.postRepo.findById(request.postId);

    if (somePost.isNone()) {
      return Err(new ResourceNotFoundError("Post not found"));
    }

    post = somePost.value;

    const contentOrError = Content.create(request.content);
    if (contentOrError.isErr()) {
      return contentOrError;
    }

    content = contentOrError.value;

    if (request.parentCommentId) {
      const someParentComment = await this.commentRepo.findById(
        request.parentCommentId
      );
      if (someParentComment.isNone()) {
        return Err(new ResourceNotFoundError("Parent comment not found"));
      }

      if (!someParentComment.value.postId.equals(post.id)) {
        return Err(
          new InvalidRequestError("Parent comment is not from the same post")
        );
      }
      parentCommentId = EntityId.create(request.parentCommentId);
    }

    const comment = Comment.create({
      authorId: requestor.id,
      content,
      parentCommentId,
      postId: post.id,
    });

    await this.commentRepo.save(comment);
    post.addCommentFromUser(requestor.id);
    await this.postRepo.save(post);
    return Ok.EMPTY;
  }
}

export default CreateComment;
