import { injectable } from "inversify";
import { MongoBaseRepository } from "./MongoBaseRepository";
import Comment from "@domain/entities/Comment";
import MongoCommentMapper from "@infrastructure/mappers/MongoCommentMapper";
import db from "@infrastructure/repositories/mongodb/MongoClient";
import ICommentRepository, {
  CommentQueryOptions,
  CommentDeleteOptions,
} from "@domain/repositories/ICommentRepository";

@injectable()
class MongoCommentRepository
  extends MongoBaseRepository<Comment>
  implements ICommentRepository
{
  constructor() {
    super(db.collection("comments"), new MongoCommentMapper());
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    const comments = await this.collectionInstance.find({ postId }).toArray();

    return comments.map((comment) => this.mapper.toDomain(comment));
  }

  async findByAuthorId(authorId: string): Promise<Comment[]> {
    const comments = await this.collectionInstance.find({ authorId }).toArray();

    return comments.map((comment) => this.mapper.toDomain(comment));
  }

  async findReplies(parentCommentId: string): Promise<Comment[]> {
    const comments = await this.collectionInstance
      .find({ parentCommentId })
      .toArray();

    return comments.map((comment) => this.mapper.toDomain(comment));
  }


  async query({
    offset = 0,
    limit = 10,
    postId,
    authorId,
  }: Partial<CommentQueryOptions>): Promise<Comment[]> {
    const dalEntities = await this.collectionInstance
      .find({
        ...(postId && { postId }),
        ...(authorId && { authorId }),
      })
      .skip(offset)
      .limit(limit)
      .toArray();

    return dalEntities.map((entity) => this.mapper.toDomain(entity));
  }

  async deleteMany(deleteOptions: CommentDeleteOptions): Promise<void> {
    // Delete all comments and their replies for the given post
    await this.collectionInstance.deleteMany({
      ...(deleteOptions.postId && { postId: deleteOptions.postId }),
      ...(deleteOptions.parentCommentId && {
        parentCommentId: deleteOptions.parentCommentId,
      }),
    });
  }
}

export default MongoCommentRepository;
