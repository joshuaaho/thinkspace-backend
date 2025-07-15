import { Err, Ok, Result } from "ts-results-es";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import IPostRepository from "@domain/repositories/IPostRepository";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { AlreadyLikedPostError, SelfLikedPostError } from "@domain/errors";
import User from "@domain/entities/User";

export type LikePostCommand = {
  postId: string;
};

@injectable()
class LikePost {
  private postRepo: IPostRepository;

  constructor(@inject(CONSTANTS.PostRepository) postRepo: IPostRepository) {
    this.postRepo = postRepo;
  }

  public async execute(
    request: LikePostCommand,
    requestor: User,
  ): Promise<
    Result<
      void,
      ResourceNotFoundError | AlreadyLikedPostError | SelfLikedPostError
    >
  > {
    const somePost = await this.postRepo.findById(request.postId);
    if (somePost.isNone()) {
      return Err(new ResourceNotFoundError("Post not found"));
    }

    const post = somePost.value;
    const someError = post.addLikeFromUser(requestor.id);
    if (someError.isErr()) {
      return someError;
    }

    await this.postRepo.save(post);
    return Ok.EMPTY;
  }
}

export default LikePost;
