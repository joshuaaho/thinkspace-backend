import { Err, Ok, Result } from "ts-results-es";
import IPostRepository from "@domain/repositories/IPostRepository";
import { injectable, inject } from "inversify";
import CONSTANTS from "@containers/constants";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { NotLikedPostError } from "@domain/errors";
import User from "@domain/entities/User";

export type UnlikePostCommand = {
  postId: string;
};

@injectable()
class UnlikePost {
  private postRepo: IPostRepository;

  constructor(@inject(CONSTANTS.PostRepository) postRepo: IPostRepository) {
    this.postRepo = postRepo;
  }

  public async execute(
    request: UnlikePostCommand,
    requestor: User,
  ): Promise<Result<void, ResourceNotFoundError | NotLikedPostError>> {
    const somePost = await this.postRepo.findById(request.postId);

    if (somePost.isNone()) {
      return Err(new ResourceNotFoundError("Post not found"));
    }

    const post = somePost.value;

    const postLikeOrError = post.removeLikeFromUser(requestor.id);

    if (postLikeOrError.isErr()) {
      return postLikeOrError;
    }

    await this.postRepo.save(post);

    return Ok.EMPTY;
  }
}

export default UnlikePost;
