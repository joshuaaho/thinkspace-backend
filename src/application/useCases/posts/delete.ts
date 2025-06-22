import { Err, Ok, Result } from "ts-results-es";
import IPostRepository from "@domain/repositories/IPostRepository";
import { inject, injectable } from "inversify";
import {
  UnauthorizedError,
  ResourceNotFoundError,
} from "@application/useCases/errors";
import CONSTANTS from "@containers/constants";
import PostDeleted from "@domain/events/PostDeleted";
import User from "@domain/entities/User";

export type DeletePostCommand = {
  postId: string;
};

@injectable()
class DeletePost {
  private postRepo: IPostRepository;  

  constructor(@inject(CONSTANTS.PostRepository) postRepo: IPostRepository) {
    this.postRepo = postRepo;
  }

  public async execute(
    request: DeletePostCommand,
    requestor: User
  ): Promise<Result<void, UnauthorizedError | ResourceNotFoundError>> {
    const somePost = await this.postRepo.findById(request.postId);

    if (somePost.isNone()) {
      return Err(new ResourceNotFoundError("Post for deletion not found"));
    }

    const post = somePost.value;

    if (!post.canBeDeletedBy(requestor.id)) {
      return Err(
        new UnauthorizedError("User is not authorized to delete this post")
      );
    }

    post.addDomainEvent(new PostDeleted(post));
    await this.postRepo.delete(post.id);

    return Ok.EMPTY;
  }
}

export default DeletePost; 