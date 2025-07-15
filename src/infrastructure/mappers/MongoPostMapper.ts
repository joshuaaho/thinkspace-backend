import Content from "@domain/entities/Post/Content";
import Title from "@domain/entities/Post/Title";
import Url from "@domain/common/Url";
import Post from "@domain/entities/Post";
import Tag from "@domain/entities/Post/Tag";
import EntityId from "@domain/core/EntityId";
import { IDataMapper } from "@domain/core/IMapper";

export interface MongoPost {
  id: string;
  title: string;
  content: string;
  imgUrls: string[];
  tags: string[];
  authorId: string;
  likedBy: string[];
  createdAt: string;
  commentedBy: string[];
}

class MongoPostMapper implements IDataMapper<Post> {
  toDomain(mongoPost: MongoPost): Post {
    const {
      id,
      title,
      content,
      imgUrls,
      tags,
      authorId,
      likedBy,
      commentedBy,
      createdAt,
    } = mongoPost;

    const post = Post.create({
      id: EntityId.create(id),
      title: Title.create(title).unwrap(),
      content: Content.create(content).unwrap(),
      imgUrls: imgUrls.map((url) => Url.create(url).unwrap()),
      tags: tags.map((tag) => Tag.create(tag).unwrap()),
      authorId: EntityId.create(authorId),
      likedBy: likedBy.map((likedBy) => EntityId.create(likedBy)),
      commentedBy: commentedBy.map((commentedBy) =>
        EntityId.create(commentedBy),
      ),
      createdAt: new Date(createdAt),
    }).unwrap();

    return post;
  }
  toDalEntity(postEntity: Post): MongoPost {
    return {
      id: postEntity.id.value,
      title: postEntity.title.value,
      content: postEntity.content.value,
      imgUrls: postEntity.imgUrls?.map((url) => url.value),
      tags: postEntity.tags?.map((tag) => tag.value),
      authorId: postEntity.authorId.value,
      likedBy: postEntity.likedBy?.map((likedBy) => likedBy.value),
      commentedBy: postEntity.commentedBy?.map(
        (commentedBy) => commentedBy.value,
      ),
      createdAt: postEntity.createdAt.toISOString(),
    };
  }
}

export default MongoPostMapper;
