import IPostRepository from "@domain/repositories/IPostRepository";
import IUserRepository from "@domain/repositories/IUserRepository";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { SortBy } from "@domain/repositories/types";

export interface QueryPostsCommand {
  offset?: number;
  limit?: number;
  tags?: string[];
  sortBy?: SortBy;
  title?: string;
  authorId?: string;
}

export type QueryPostsResponse = {
  authorId: string;
  username: string;
  authorProfileImgUrl: string;
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
  likedBy: string[];
  imgUrls: string[];
  commentedBy: string[];
}[];

@injectable()
class QueryPostsUseCase {
  private postRepo: IPostRepository;
  private userRepo: IUserRepository;
  constructor(
    @inject(CONSTANTS.PostRepository) postRepo: IPostRepository,
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
  ) {
    this.postRepo = postRepo;
    this.userRepo = userRepo;
  }

  public async execute({
    tags,
    sortBy,
    title,
    offset,
    limit,
    authorId,
  }: QueryPostsCommand): Promise<QueryPostsResponse> {
    const posts = await this.postRepo.query({
      tags,
      sortBy,
      title,
      offset,
      limit,
      authorId,
    });

    const queryPostsResponse = await Promise.all(
      posts.map(async (post) => {
        const user = (
          await this.userRepo.findById(post.authorId.value)
        ).unwrap();

        return {
          authorId: post.authorId.value,
          username: user.username.value,
          authorProfileImgUrl: user.profileImgUrl.value,
          id: post.id.value,
          title: post.title.value,
          content: post.content.value,
          createdAt: post.createdAt.toString(),
          tags: post.tags.map((tag) => tag.value),
          likedBy: post.likedBy.map((userId) => userId.value),
          imgUrls: post.imgUrls.map((imgUrl) => imgUrl.value),
          commentedBy: post.commentedBy.map((userId) => userId.value),
        };
      }),
    );

    return queryPostsResponse;
  }
}

export default QueryPostsUseCase;
