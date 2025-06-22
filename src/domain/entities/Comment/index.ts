import { Result, Ok, Err } from 'ts-results-es';
import BaseEntity from '@domain/core/BaseEntity';
import EntityId from '@domain/core/EntityId';
import { AlreadyLikedCommentError, NotLikedCommentError, SelfLikedCommentError}  from '@domain/errors';
import { UnauthorizedError } from "@application/useCases/errors";
import Content from '@domain/entities/Comment/Content';
import User from '../User';
import CommentDeleted from '@domain/events/CommentDeleted';
import CommentLikedEvent  from '@domain/events/CommentLiked';


interface CommentProps {
  id?: EntityId;
  authorId: EntityId;
  content: Content;
  parentCommentId?: EntityId;
  likedBy?: EntityId[];
  postId: EntityId;
  createdAt?: Date;
}

class Comment extends BaseEntity {
  private _authorId: EntityId;
  private _content: Content;
  private _parentCommentId: EntityId | undefined;
  private _likedBy: EntityId[] = [];
  private _postId: EntityId;
  private constructor(props: CommentProps) {
    super(props.id, props.createdAt);
    this._authorId = props.authorId;
    this._content = props.content;
    this._parentCommentId = props.parentCommentId;
    this._likedBy = props.likedBy || [];
    this._postId = props.postId;
  }

  public static create(props: CommentProps): Comment{
    return new Comment(props);
  }


  
  public updateCommentFromUser(userId: EntityId, content: Content): Result<void, UnauthorizedError> {
    if (!this.authorId.equals(userId)) {
      return Err(new UnauthorizedError("Cannot update a comment that is not authored by the user"));
    }
    this._content = content;
    return Ok.EMPTY;
  }

  public addLikeFromUser(userId: EntityId): Result<void, AlreadyLikedCommentError | SelfLikedCommentError> {
      if (this.isLikedByUser(userId)) {
        return Err(new AlreadyLikedCommentError("Cannot like a comment that is already liked"));
    }
    if (this.authorId.equals(userId)) {
      return Err(new SelfLikedCommentError("Cannot self like a comment"));
    }
    this._likedBy.push(userId);
    this.addDomainEvent(new CommentLikedEvent(this));
    return Ok.EMPTY;
  }

  public removeLikeFromUser(userId: EntityId): Result<void, NotLikedCommentError> {
    if (!this.isLikedByUser(userId)) {
      return Err(new NotLikedCommentError("Cannot unlike a comment that is not liked"));
    }
    this._likedBy = this._likedBy.filter(
      (entityId) => !entityId.equals(userId)
    );
    return Ok.EMPTY;
  }

  public canBeDeletedBy(userId: EntityId): boolean {
    return this._authorId.equals(userId);
  }

  public updateFromUserEdits(user: User, commentContent: Content): Result<void, UnauthorizedError> {
    if (!this._authorId.equals(user.id)) {
      return Err(new UnauthorizedError("User is not authorized to edit this comment"));
    }
    this._content = commentContent;
    return Ok.EMPTY;
  }

  private isLikedByUser(userId: EntityId): boolean {
    return this._likedBy.some((entityId) => entityId.equals(userId));
  }
  
  public get content() {
    return this._content;
  }

  public get likedBy() {
    return this._likedBy;
  }
  
  public get parentCommentId() {
    return this._parentCommentId;
  }
  public get authorId() {
    return this._authorId;
  }
  public get postId() {
    return this._postId;
  }


}

export default Comment; 