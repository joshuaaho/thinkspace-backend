import { Ok, Result } from "ts-results-es";
import IPostRepository from "@domain/repositories/IPostRepository";
import { injectable, inject } from "inversify";
import Title from "@domain/entities/Post/Title";
import Content from "@domain/entities/Post/Content";
import Url from "@domain/common/Url";
import Tag from "@domain/entities/Post/Tag";
import Post from "@domain/entities/Post";
import { ValidationError } from "@domain/errors";
import CONSTANTS from "@containers/constants";
import User from "@domain/entities/User";

export type CreatePostCommand = {
  title: string;
  imgUrls?: string[];
  content: string;
  tags?: string[];
};

export type CreatePostResponse = {
  postId: string;
};

@injectable()
class CreatePost {
  private postRepo: IPostRepository;

  constructor(@inject(CONSTANTS.PostRepository) postRepo: IPostRepository) {
    this.postRepo = postRepo;
  }

  public async execute(
    request: CreatePostCommand,
    requestor: User,
  ): Promise<Result<CreatePostResponse, ValidationError>> {
    const titleOrError = Title.create(request.title);

    if (titleOrError.isErr()) {
      return titleOrError;
    }

    const contentOrError = Content.create(request.content);

    if (contentOrError.isErr()) {
      return contentOrError;
    }

    const urlsOrError = Result.all(
      request.imgUrls?.map((imgUrl) => Url.create(imgUrl)) ?? [],
    );

    if (urlsOrError.isErr()) {
      return urlsOrError;
    }

    const tagsOrError = Result.all(
      request.tags?.map((tag) => Tag.create(tag)) ?? [],
    );

    if (tagsOrError.isErr()) {
      return tagsOrError;
    }

    const postOrError = Post.create({
      title: titleOrError.value,
      content: contentOrError.value,
      authorId: requestor.id,
      imgUrls: urlsOrError.value,
      tags: tagsOrError.value,
    });

    if (postOrError.isErr()) {
      return postOrError;
    }

    const post = postOrError.value;

    await this.postRepo.save(post);

    return Ok({ postId: post.id.value });
  }
}

export default CreatePost;
