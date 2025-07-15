import { injectable } from "inversify";
import { MongoBaseRepository } from "./MongoBaseRepository";
import Post from "@domain/entities/Post";
import MongoPostMapper from "@infrastructure/mappers/MongoPostMapper";
import IPostRepository, {
  PostQueryOptions,
} from "@domain/repositories/IPostRepository";

import db from "@infrastructure/repositories/mongodb/MongoClient";

@injectable()
class MongoPostRepository
  extends MongoBaseRepository<Post>
  implements IPostRepository
{
  constructor() {
    super(db.collection("posts"), new MongoPostMapper());
  }

  private getSortStage(sortBy: string) {
    switch (sortBy) {
      case "oldest":
        return { $sort: { createdAt: 1 } };
      case "mostLiked":
        return [
          { $addFields: { likeCount: { $size: "$likedBy" } } },
          { $sort: { likeCount: -1 } },
        ];
      default:
        return { $sort: { createdAt: -1 } };
    }
  }

  async query({
    offset = 0,
    limit = 10,
    tags,
    sortBy = "newest",
    title,
    authorId,
  }: PostQueryOptions): Promise<Post[]> {
    const sortStage = this.getSortStage(sortBy);
    const pipeline = [
      {
        $match: {
          ...(tags ? { tags: { $in: tags } } : {}),
          ...(title ? { title: { $regex: title, $options: "i" } } : {}),
          ...(authorId ? { authorId: authorId } : {}),
        },
      },
      ...(Array.isArray(sortStage) ? sortStage : [sortStage]),
      { $skip: offset },
      { $limit: limit },
    ];

    const dalEntities = await this.collectionInstance
      .aggregate(pipeline)
      .toArray();

    return dalEntities.map((entity) => this.mapper.toDomain(entity));
  }
}

export default MongoPostRepository;
