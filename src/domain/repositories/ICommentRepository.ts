import Comment from "@domain/entities/Comment";
import IRepository from "@domain/repositories/IRepository";
import { BaseQueryOptions, SortBy } from "@domain/repositories/types";

export interface CommentQueryOptions extends BaseQueryOptions {
  postId: string;
  parentCommentId: string;
  authorId: string;
  sortBy: SortBy;
}
export interface CommentDeleteOptions {
  postId: string;
  parentCommentId: string;
}

interface ICommentRepository extends IRepository<Comment> {
  query(queryOptions: Partial<CommentQueryOptions>): Promise<Comment[]>;
  deleteMany(deleteOptions: Partial<CommentDeleteOptions>): Promise<void>;
}

export default ICommentRepository;
