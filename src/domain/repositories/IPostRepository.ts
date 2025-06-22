import Post from "@domain/entities/Post";
import IRepository from "@domain/repositories/IRepository";
import { BaseQueryOptions } from "@domain/repositories/types";

export type SortBy = "newest" | "oldest" | "most-liked";

export type PostQueryOptions = BaseQueryOptions & Partial<{
  tags: string[];
  sortBy: SortBy;
  title: string;
  authorId: string;
}>;

interface IPostRepository extends IRepository<Post> {
  query(queryOptions: Partial<PostQueryOptions>): Promise<Post[]>;
}
export default IPostRepository;
