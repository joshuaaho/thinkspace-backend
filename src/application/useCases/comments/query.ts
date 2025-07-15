import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import IUserRepository from "@domain/repositories/IUserRepository";
import { Result, Ok } from "ts-results-es";
import { SortBy } from "@domain/repositories/types";

export interface QueryCommentsCommand {
  postId?: string;
  offset?: number;
  limit?: number;
  authorId?: string;
  sortBy?: SortBy;
}

export type QueryCommentsResponse = {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  authorProfileImgUrl: string;
  createdAt: string;
  likedBy: string[];
  parentCommentId?: string;
}[];

@injectable()
class QueryComments {
  private commentRepo: ICommentRepository;
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.CommentRepository) commentRepo: ICommentRepository,
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
  ) {
    this.commentRepo = commentRepo;
    this.userRepo = userRepo;
  }

  public async execute(
    request: QueryCommentsCommand,
  ): Promise<Result<QueryCommentsResponse, never>> {
    const comments = await this.commentRepo.query({
      postId: request.postId,
      offset: request.offset,
      limit: request.limit,
      authorId: request.authorId,
      sortBy: request.sortBy,
    });

    const queryCommentsResponse = await Promise.all(
      comments.map(async (comment) => {
        const user = (
          await this.userRepo.findById(comment.authorId.value)
        ).unwrap();

        return {
          id: comment.id.value,
          content: comment.content.value,
          authorId: comment.authorId.value,
          authorUsername: user.username.value,
          authorProfileImgUrl: user.profileImgUrl.value,
          createdAt: comment.createdAt.toString(),
          likedBy: comment.likedBy.map((id) => id.value),
          parentCommentId: comment.parentCommentId?.value,
          postId: comment.postId.value,
        };
      }),
    );

    return Ok(queryCommentsResponse);
  }
}

export default QueryComments;
