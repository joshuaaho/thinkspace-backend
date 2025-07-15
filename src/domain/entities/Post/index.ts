import { Result, Ok, Err } from "ts-results-es";
import Title from "@domain/entities/Post/Title";
import EntityId from "@domain/core/EntityId";
import Content from "@domain/entities/Post/Content";
import Url from "@domain/common/Url";
import BaseEntity from "@domain/core/BaseEntity";
import Tag from "@domain/entities/Post/Tag";
import {
  ValidationError,
  NotLikedPostError,
  AlreadyLikedPostError,
  SelfLikedPostError,
} from "@domain/errors";
import User from "@domain/entities/User";
import { UnauthorizedError } from "@application/useCases/errors";
import PostCreated from "@domain/events/PostCreated";
import PostLiked from "@domain/events/PostLiked";

interface UpdateablePostProps {
  title?: Title;
  content?: Content;
  imgUrls?: Url[];
  tags?: Tag[];
}
interface PostProps {
  id?: EntityId;
  title: Title;
  content: Content;
  authorId: EntityId;
  imgUrls?: Url[];
  tags?: Tag[];
  likedBy?: EntityId[];
  commentedBy?: EntityId[];
  createdAt?: Date;
}

class Post extends BaseEntity {
  private _authorId: EntityId;
  private _title: Title;
  private _content: Content;
  private _imgUrls: Url[];
  private _tags: Tag[];
  private _likedBy: EntityId[] = [];
  private _commentedBy: EntityId[] = [];
  private constructor(props: any) {
    super(props.id, props.createdAt);
    this._title = props.title;
    this._content = props.content;
    this._authorId = props.authorId;
    this._imgUrls = props.imgUrls || [];
    this._tags = props.tags || [];
    this._likedBy = props.likedBy || [];
  }

  public static create(props: PostProps): Result<Post, ValidationError> {
    if (props.tags && props.tags.length > 5) {
      return Err(new ValidationError("Too many tags"));
    }

    const post = new Post({
      id: props.id,
      title: props.title,
      content: props.content,
      imgUrls: props.imgUrls,
      tags: props.tags,
      authorId: props.authorId,
      likedBy: props.likedBy,
      commentedBy: props.commentedBy,
      createdAt: props.createdAt,
    });

    if (!props.id) {
      post.addDomainEvent(new PostCreated(post));
    }

    return Ok(post);
  }

  get title(): Title {
    return this._title;
  }

  get content(): Content {
    return this._content;
  }

  get authorId(): EntityId {
    return this._authorId;
  }

  get tags(): Tag[] {
    return this._tags;
  }

  get likedBy(): EntityId[] {
    return this._likedBy;
  }

  get imgUrls(): Url[] {
    return this._imgUrls;
  }

  get commentedBy(): EntityId[] {
    return this._commentedBy;
  }

  public addCommentFromUser(userId: EntityId) {
    this._commentedBy.push(userId);
  }

  public addLikeFromUser(
    userId: EntityId,
  ): Result<void, AlreadyLikedPostError | SelfLikedPostError> {
    if (this.isLikedByUser(userId)) {
      return Err(new AlreadyLikedPostError("User already liked this post"));
    }
    if (this._authorId.equals(userId)) {
      return Err(new SelfLikedPostError("User cannot like their own post"));
    }
    this._likedBy.push(userId);
    this.addDomainEvent(new PostLiked(this));
    return Ok.EMPTY;
  }

  public removeLikeFromUser(userId: EntityId): Result<void, NotLikedPostError> {
    if (!this.isLikedByUser(userId)) {
      return Err(
        new NotLikedPostError("Cannot unlike a post that is not liked"),
      );
    }
    this._likedBy = this._likedBy.filter(
      (entityId) => !entityId.equals(userId),
    );
    return Ok.EMPTY;
  }

  private isLikedByUser(userId: EntityId): boolean {
    return this._likedBy.some((entityId) => entityId.equals(userId));
  }

  public canBeDeletedBy(userId: EntityId): boolean {
    return this._authorId.equals(userId);
  }

  public updateFromUserEdits(
    user: User,
    partialPost: UpdateablePostProps,
  ): Result<void, UnauthorizedError> {
    if (!this._authorId.equals(user.id)) {
      return Err(
        new UnauthorizedError("User is not authorized to edit this post"),
      );
    }
    if (partialPost.tags && partialPost.tags.length > 5) {
      return Err(new ValidationError("Too many tags"));
    } else {
      this._tags = partialPost.tags || this._tags;
    }
    if (partialPost.title) {
      this._title = partialPost.title;
    }
    if (partialPost.content) {
      this._content = partialPost.content;
    }
    if (partialPost.imgUrls) {
      this._imgUrls = partialPost.imgUrls;
    }

    return Ok.EMPTY;
  }
}

export default Post;
