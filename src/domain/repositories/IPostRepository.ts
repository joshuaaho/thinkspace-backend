import Post from "@domain/entities/Post";
import IRepository from "@domain/repositories/IRepository";
import { BaseQueryOptions, SortBy } from "@domain/repositories/types";

export type PostQueryOptions = BaseQueryOptions &
  Partial<{
    tags: string[];
    sortBy: SortBy;
    title: string;
    authorId: string;
  }>;

interface IPostRepository extends IRepository<Post> {
  query(queryOptions: Partial<PostQueryOptions>): Promise<Post[]>;
}
export default IPostRepository;
