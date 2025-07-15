import { Err, Ok, Result } from "ts-results-es";
import IPostRepository from "@domain/repositories/IPostRepository";
import { injectable, inject } from "inversify";
import Title from "@domain/entities/Post/Title";
import Content from "@domain/entities/Post/Content";
import Url from "@domain/common/Url";
import Tag from "@domain/entities/Post/Tag";
import CONSTANTS from "@containers/constants";
import { ValidationError } from "@domain/errors";
import {
  UnauthorizedError,
  ResourceNotFoundError,
} from "@application/useCases/errors";
import User from "@domain/entities/User";

export interface EditPostCommand {
  title?: string;
  imgUrls?: string[];
  content?: string;
  tags?: string[];
  postId: string;
}

@injectable()
class EditPost {
  private postRepo: IPostRepository;

  constructor(@inject(CONSTANTS.PostRepository) postRepo: IPostRepository) {
    this.postRepo = postRepo;
  }

  public async execute(
    request: EditPostCommand,
    requestor: User,
  ): Promise<
    Result<void, ValidationError | UnauthorizedError | ResourceNotFoundError>
  > {
    let tagsUpdate: Tag[] | undefined;
    let contentUpdate: Content | undefined;
    let imgUrlsUpdate: Url[] | undefined;
    let titleUpdate: Title | undefined;

    const somePost = await this.postRepo.findById(request.postId);

    if (somePost.isNone()) {
      return Err(new ResourceNotFoundError("Post for editing not found"));
    }

    const post = somePost.value;

    if (request.title !== undefined) {
      const titleOrError = Title.create(request.title);

      if (titleOrError.isErr()) {
        return titleOrError;
      }
      titleUpdate = titleOrError.value;
    }

    if (request.content !== undefined) {
      const contentOrError = Content.create(request.content);

      if (contentOrError.isErr()) {
        return contentOrError;
      }
      contentUpdate = contentOrError.value;
    }

    if (request.imgUrls !== undefined) {
      const urlsOrError = request.imgUrls.map((imgUrl) => Url.create(imgUrl));
      const result = Result.all(urlsOrError);

      if (result.isErr()) {
        return result;
      }

      imgUrlsUpdate = result.value;
    }

    if (request.tags !== undefined) {
      const tagsOrError = request.tags.map((tag) => Tag.create(tag));
      const result = Result.all(tagsOrError);
      if (result.isErr()) {
        return result;
      }
      tagsUpdate = result.value;
    }

    const someError = post.updateFromUserEdits(requestor, {
      title: titleUpdate,
      content: contentUpdate,
      imgUrls: imgUrlsUpdate,
      tags: tagsUpdate,
    });

    if (someError.isErr()) {
      return someError;
    }

    await this.postRepo.save(post);

    return Ok.EMPTY;
  }
}

export default EditPost;
