import { Err, Ok, Result } from "ts-results-es";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IPostRepository from "@domain/repositories/IPostRepository";
import IUserRepository from "@domain/repositories/IUserRepository";
import { ResourceNotFoundError } from "@application/useCases/errors";

export type GetPostByIdCommand = {
  postId: string;
};

export type GetPostByIdResponse = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  username: string;
  authorProfileImgUrl: string;
  tags: string[];
  imgUrls: string[];
  createdAt: Date;
  likedBy: string[];
  commentedBy: string[];
};

@injectable()
class GetPostByIdUseCase {
  private postRepo: IPostRepository;
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.PostRepository) postRepo: IPostRepository,
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository,
  ) {
    this.postRepo = postRepo;
    this.userRepo = userRepo;
  }

  public async execute(
    request: GetPostByIdCommand,
  ): Promise<Result<GetPostByIdResponse, ResourceNotFoundError>> {
    const somePost = await this.postRepo.findById(request.postId);
    if (somePost.isNone()) {
      return Err(new ResourceNotFoundError("Post not found"));
    }

    const post = somePost.unwrap();

    const author = (await this.userRepo.findById(post.authorId.value)).unwrap();

    const response: GetPostByIdResponse = {
      id: post.id.value,
      title: post.title.value,
      content: post.content.value,
      authorId: post.authorId.value,
      username: author.username.value,
      authorProfileImgUrl: author.profileImgUrl.value,
      tags: post.tags.map((tag) => tag.value),
      createdAt: post.createdAt,
      likedBy: post.likedBy.map((id) => id.value),
      commentedBy: post.commentedBy.map((id) => id.value),
      imgUrls: post.imgUrls.map((url) => url.value),
    };

    return Ok(response);
  }
}

export default GetPostByIdUseCase;
