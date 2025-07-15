import EntityId from "@domain/core/EntityId";
import { IDataMapper } from "@domain/core/IMapper";
import Comment from "@domain/entities/Comment";
import Content from "@domain/entities/Comment/Content";

export interface MongoComment {
  id: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
  likedBy: string[];
  postId: string;
  createdAt: string;
}

class MongoCommentMapper implements IDataMapper<Comment> {
  toDomain(dalEntity: MongoComment): Comment {
    return Comment.create({
      id: EntityId.create(dalEntity.id),
      authorId: EntityId.create(dalEntity.authorId),
      content: Content.create(dalEntity.content).unwrap(),
      parentCommentId: dalEntity.parentCommentId
        ? EntityId.create(dalEntity.parentCommentId)
        : undefined,
      likedBy: dalEntity.likedBy.map((id) => EntityId.create(id)),
      postId: EntityId.create(dalEntity.postId),
      createdAt: new Date(dalEntity.createdAt),
    });
  }

  toDalEntity(entity: Comment): MongoComment {
    return {
      id: entity.id.value,
      authorId: entity.authorId.value,
      content: entity.content.value,
      parentCommentId: entity.parentCommentId?.value,
      likedBy: entity.likedBy.map((id) => id.value),
      postId: entity.postId.value,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}

export default MongoCommentMapper;
